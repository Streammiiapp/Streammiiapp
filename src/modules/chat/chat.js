import React, {
   useState,
   useEffect,
   useRef,
   forwardRef,
   useImperativeHandle,
} from 'react';
import {
   View,
   Image,
   Platform,
   Keyboard,
   TextInput,
   SafeAreaView,
   ImageBackground

} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';

import { ButtonView, ImageButton, ImageHandler, Separator, } from '../../reuseableComponents';

import { selectSingleImage } from '../../services/MultipickerUtils';
import { Fonts, Colors, AppStyles, Images, Metrics } from '../../theme';
import Utils from '../../utility';

// redux imports
import { useSelector } from 'react-redux';

// socket chat imports
import {
   sendMessage,
   emitGetChatRoomId,
   emitLoadChatHistory,
   emitLeaveRoom,
   removeChatListeners,
   chatListeners,
} from './chatSocketHandler';
import { modalInToGiftedChatObjects, uploadImage } from './chatHelper';
import styles from '../../containers/ChatRoom/styles';
import { Paragraph } from '../../reuseableComponents/Typography';
import moment from 'moment';
import utility from '../../utility';
import { useKeyboard } from '../../hooks';
import { getNotificationCount } from '../../reuseableFunctions';

const ChatScreen = ({ route, navigation }) => {
   const inputRef = useRef();
   const { otherUser } = route.params;
   const { visible, height } = useKeyboard();
   const [state, setState] = useState({
      chatRoomId: 0,
      messages: [],
      isLoadEarlier: false,
      isLoadingEarlier: false,
      isFetching: true,
   });
   const user = useSelector(({ user }) => user.data);
   React.useLayoutEffect(() => {
      navigation.setOptions({
         title: otherUser.name,
      });
   }, [navigation]);

   const [keyboardHeight, setKeyboardHeight] = useState(0);
   useEffect(() => {
      if (Platform.OS === 'ios') {
         KeyboardManager.setEnable(false);
         KeyboardManager.setEnableAutoToolbar(false);
      }

      chatListeners(onNewMessageReceived);


      emitGetChatRoomId(
         {
            user_id: user.id,
            target_id: otherUser.id,
            is_anonymous: 0,
            created_by: user.id,
         },
         onChatRoomIdReceived,
      );

      return () => {
         if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(true);
            KeyboardManager.setEnableAutoToolbar(true);
            KeyboardManager.setShouldResignOnTouchOutside(false);
         }
         removeChatListeners();
      };
   }, []);

   useEffect(() => {
      getNotificationCount();
   }, [])

   const onChatRoomIdReceived = (data) => {
      setState((prevState) => ({ ...prevState, chatRoomId: data.chat_room_id }));
      const payload = {
         user_id: user.id,
         chat_room_id: data.chat_room_id,
         is_anonymous: 0,
      };
      emitLoadChatHistory(payload, onChatHistoryReceived);
   };

   const onChatHistoryReceived = (messages, isConcat = false) => {
      setState((prevState) => ({
         ...prevState,
         isLoadEarlier:
            messages.length && messages.length % 20 == 0 ? true : false,
         isLoadingEarlier: false,
         isFetching: false,
         messages: isConcat
            ? [...prevState.messages, ...modalInToGiftedChatObjects(messages)]
            : modalInToGiftedChatObjects(messages),
      }));
   };

   const onNewMessageReceived = (data) => {
      const { chat_room_id } = data;
      const { chatRoomId } = state;

      if (chat_room_id == chatRoomId) {
         setState((prevState) => ({
            ...prevState,
            messages: [
               ...modalInToGiftedChatObjects([data]),
               ...prevState.messages,
            ],
         }));
      } else {
         if (chatRoomId == 0) {
            setState((prevState) => ({
               ...prevState,
               messages: [
                  ...modalInToGiftedChatObjects([data]),
                  ...prevState.messages,
               ],
               chatRoomId: chat_room_id,
            }));
         }
      }
   };

   useEffect(() => {
      Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

      // cleanup function
      return () => {
         Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
         Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      };
   }, []);

   const _keyboardDidHide = () => {
      if (!Utils.isPlatformAndroid()) {
         setKeyboardHeight(0);
      }
   };

   const _keyboardDidShow = ({ endCoordinates }) => {
      if (!Utils.isPlatformAndroid()) {
         setKeyboardHeight(
            Utils.isNotchedDevice
               ? endCoordinates.height - Metrics.widthRatio(34)
               : endCoordinates.height,
         );
      }
   };

   const onLoadEarlier = () => {
      setState((prevState) => ({ ...prevState, isLoadingEarlier: true }));
      const { messages, chatRoomId } = state;
      const payload = {
         user_id: user.id,
         chat_room_id: chatRoomId,
         is_anonymous: 0,
         last_record_id: messages[messages.length - 1]._id,
      };
      emitLoadChatHistory(payload, (messages) =>
         onChatHistoryReceived(messages, true),
      );
   };
   const onPressImage = (url) => () => {
      Utils.getImageViewerRef().setImagesArray([{ url }]);
      Utils.getImageViewerRef().show();
   };

   const onSend = (messages = []) => {
      const message = inputRef.current.getValue();

      if (message.length) {
         const payload = {
            user_id: user.id,
            target_id: otherUser.id,
            group_type: 'single',
            chat_room_id: state.chatRoomId,
            message,
            message_type: 'text',
            is_anonymous: 0,
            created_by: user.id,
         };

         sendMessage(payload);
         inputRef.current.setText('');
      }
   };

   const onPickImage = () => {
      Keyboard.dismiss();
      setTimeout(() => {
         selectSingleImage()
            .then((res) =>
               uploadImage(res.path)
                  .then((data) => {
                     sendMessage({
                        user_id: user.id,
                        target_id: otherUser.id,
                        group_type: 'single',
                        chat_room_id: state.chatRoomId,
                        message: '',
                        message_type: 'image',
                        is_anonymous: 0,
                        file_url: data.data.file_url,
                        created_by: user.id,
                     });
                  })
                  .catch((err) => console.log('err : ', err)),
            )
            .catch((err) => console.log('err : ', err));
      }, 400);
   };

   // const renderInputToolbar = (props) => {
   //    return (
   //       <View
   //          style={{
   //             flexDirection: 'row',
   //             marginBottom: keyboardHeight,
   //             width: Metrics.screenWidth,
   //             backgroundColor: 'white',
   //             alignItems: 'center',
   //          }}>
   //          <ButtonView
   //             style={{ height: 44, width: 44, ...AppStyles.centerAligned }}
   //             onPress={onPickImage}>
   //             <Image source={Images.icAttachment} resizeMode={'center'} />
   //          </ButtonView>
   //          <Input ref={inputRef} />
   //          <ButtonView
   //             style={{ height: 44, width: 44, ...AppStyles.centerAligned }}
   //             onPress={onSend}>
   //             <Image source={Images.icSendMessage} resizeMode={'center'} />
   //          </ButtonView>
   //       </View>
   //    );
   // };

   const renderBubbleMessage = (props) => {
      // const { text, sender_id, createdAt, user } = currentMessage;
      // return (
      //    <View>
      //       <View
      //          style={[
      //             user._id == user.id ? styles.userMsg : styles.senderMsg,
      //             styles.messageWrapper,
      //          ]}>
      //          <Paragraph
      //             size={14}
      //             style={
      //                user._id == user.id
      //                   ? styles.messageText
      //                   : styles.messageTextSender
      //             }
      //             color={Colors.white}>
      //             {text}
      //          </Paragraph>
      //       </View>
      //       <Paragraph
      //          size={12}
      //          style={[
      //             styles.time,
      //             user._id == user.id ? styles.timeRight : styles.timeLeft,
      //          ]}>
      //          {utility.timeFromNow(createdAt)}
      //       </Paragraph>
      //    </View>
      // );
      return (
         <Bubble
            {...props}

            textStyle={{
               left: {
                  ...Fonts.Regular(15), color: Colors.white
               },
               right: {
                  ...Fonts.Regular(15), color: Colors.white
               },
            }}
            wrapperStyle={{
               left: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
               },
               right: {
                  backgroundColor: 'rgba(10, 148, 255, 0.8)',

               },
            }}

         />
      );
   };

   const renderMessageImage = ({ currentMessage }) => {
      return (
         <ButtonView onPress={onPressImage(currentMessage.image)}>
            <ImageHandler
               source={{ uri: currentMessage.image }}
               style={{ width: 160, height: 160, margin: 4, borderRadius: 12 }}
            />
         </ButtonView>
      );
   };

   const renderSendInputField = () => {
      return (
         <View style={styles.inputContainer}>
            <Separator />
            <View style={styles.inputSecContainer}>
               <ImageButton
                  style={styles.imageButton}
                  source={Images.icAttachment}
                  onPress={onPickImage}
               />
               <Input ref={inputRef} />
               <ImageButton
                  style={{ paddingHorizontal: 15 }}
                  onPress={onSend}
                  source={Images.icSendMessage}
               />
            </View>
         </View>
      );
   };

   const renderSendButton = props => {
      return (
         <Send {...props}>
            <View style={styles.sendCon}>
               <Image source={Images.icSendMessage} resizeMode={'center'} />
            </View>
         </Send>
      );
   };

   console.log('keyboard height : ', keyboardHeight);

   return !state.isFetching ? (
      <ImageBackground source={Images.bgLogin} style={{
         height: '100%',
         width: '100%'
      }}>
         <View
            style={[
               styles.containerInput,
               {
                  paddingVertical: Metrics.heightRatio(8),
                  paddingBottom:
                     !utility.isPlatformAndroid() && visible ? height + 20 : 0,
               },
            ]}>
            <GiftedChat
               renderSend={renderSendButton}
               renderBubble={renderBubbleMessage}
               textInputStyle={{
                  paddingTop: 8,
                  ...Fonts.Regular(Fonts.Size.xSmall, Colors.black),
               }}
               renderInputToolbar={renderSendInputField}
               // renderMessageImage={renderMessageImage}
               messages={state.messages}
               user={{
                  _id: user.id,
               }}
               isKeyboardInternallyHandled={false}
               messagesContainerStyle={{
                  // marginHorizontal: Metrics.baseMargin,
                  paddingBottom: Metrics.baseMargin,
                  marginBottom: keyboardHeight,
               }}
               loadEarlier={state.isLoadEarlier}
               onLoadEarlier={onLoadEarlier}
               isLoadingEarlier={state.isLoadingEarlier}
            />
            {/* {renderInputToolbar()} */}
         </View>
      </ImageBackground>
   ) : (
      <View style={{ flex: 1, ...AppStyles.centerAligned }}>
         {/* <Loader /> */}
      </View>
   );
};

export default ChatScreen;

const Input = forwardRef((props, ref) => {
   const [val, setVal] = useState('');

   useImperativeHandle(ref, () => ({
      setText: (txt) => setVal(txt),
      getValue: () => val,
   }));

   return (
      <TextInput
         placeholder="Type a message"
         style={{
            flex: 1,
            paddingHorizontal: Metrics.baseMargin,
            paddingVertical: Metrics.smallMargin,
            height: Metrics.heightRatio(48),
            color: Colors.white,
         }}
         multiline
         placeholderTextColor={Colors.white}
         value={val}
         onChangeText={(txt) => setVal(txt)}
      />
   );
});
