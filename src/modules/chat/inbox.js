import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, ImageBackground, Platform, UIManager, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Swipeout from 'react-native-swipeout';

import { ButtonView, ImageButton, } from '../../reuseableComponents';
import { navigate, push } from '../../services/NavigationService';


import { emitLoadRecentChats, emitDeleteChatThread } from './inboxSocketHandler';

import { AppStyles, Images, Metrics, Colors, Fonts } from '../../theme';
import { ChatCell } from '../../components';
import ListEmpty from '../../reuseableComponents/FlatListHandler/ListEmpty';

const index = ({ navigation }) => {
   // const user = useSelector(({ userReducer }) => userReducer);
   const user = useSelector(({ user }) => user)
   const [state, setState] = React.useState({ data: [], isFetching: true });


   const [firstTab, setFirstTab] = useState(true)


   useEffect(() => {
      navigation.setOptions({
         headerRight: (firstTab || !!showGroupList) ? renderHeaderRight : null,
      });

      if (
         Platform.OS === 'android' &&
         UIManager.setLayoutAnimationEnabledExperimental
      ) {
         UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      navigationHandler;
   })


   const handleClick = (x) => {
      LayoutAnimation.configureNext(
         LayoutAnimation.create(
            1000,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity,
         ),
      );
      setFirstTab(!firstTab);
   };

   const renderHeaderRight = () => {
      return (
         <ImageButton
            source={Images.icCreateGroup}
            onPress={navigationHandler}
         />
      )
   }

   const navigationHandler = () => {
      if (!firstTab && !!showGroupList) {
         navigate('RoomSetup')
      } else {
         navigate('NewMessage')
      }
   }


   React.useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <View style={AppStyles.flexRow}>
               <ButtonView onPress={() => push('SearchScreen')}>
                  <Image source={Images.icSearch} />
               </ButtonView>
               <ButtonView onPress={() => push('Notification')}>
                  <Image source={Images.icNotification} />
               </ButtonView>
            </View>
         ),
      });
   }, [navigation]);

   React.useEffect(() => {
      const unsubscribe = navigation.addListener('focus', (e) => {
         fetchInbox();
      });
      return unsubscribe;
   }, [navigation]);

   const fetchInbox = () => {
      emitLoadRecentChats(user.data, (res) => {
         setState({
            data: res.map(
               ({
                  target_user_data,
                  id,
                  last_chat_message,
                  unread_message_counts,
               }) => ({
                  id,
                  usrId: target_user_data.id,
                  name: target_user_data.name,
                  image: target_user_data.image_url,
                  lastMsg: last_chat_message.message,
                  createdAt: last_chat_message.created_at,
                  cellType: 'MatchesStatus',
                  isUnread: +unread_message_counts ? true : false,
               }),
            ),
            isFetching: false,
         });
      });
   };

   const deleteChatItem = ({ item }) => {

      emitDeleteChatThread(
         {
            user_id: user.data.id,
            chat_room_id: item.id,
            target_id: item.usrId,
         },
         fetchInbox,
      );
   };
   const renderListEmpty = () => {
      return (

         !state.data.length ? (
            <ListEmpty message={"Start new chat"} />
         ) : null
      )
   }

   const onChat = (otherUser) => () =>
      push('ChatRoom', { otherUser: { ...otherUser, id: otherUser.usrId } });

   return !state.isFetching ? (
      <ImageBackground style={AppStyles.percent100}>
         {/* <View style={[AppStyles.containerMargin, styles.innerContainer]}> */}
         <FlatList
            showsVerticalScrollIndicator={false}
            data={state.data}
            keyExtractor={(item, index) => item.cellType + '-' + index}
            ListEmptyComponent={renderListEmpty}
            renderItem={(item) => {
               return (<Swipeout
                  autoClose
                  style={styles.swipeout}
                  right={[
                     {
                        onPress: () => {
                           deleteChatItem(item);
                        },
                        component: (
                           <View style={styles.containerSwipeBtnLeft}>
                              <View style={styles.wrapperIcDelete}>
                                 <Image
                                    source={Images.icDisliked}
                                    style={styles.icDelete}
                                 />
                              </View>
                           </View>
                        ),
                     },
                  ]}>
                  <ChatCell item={item.item} onPress={onChat(item.item)} />
               </Swipeout>)
            }}
         />
         {/* <ButtonView
          style={styles.icAddChat}
          onPress={() => push('ChatScreen', {otherUser})}>
          <Image source={Images.icAddChat} />
        </ButtonView> */}
         {/* </View> */}
      </ImageBackground>
   ) : (
      <View style={styles.containerLoader}>
         {/* <Loader /> */}
      </View>
   );
};

export default index;

const styles = {
   innerContainer: {
      marginTop: Metrics.navBarHeight,
      flex: 1,
   },
   swipeout: { backgroundColor: Colors.black },
   containerSwipeBtnLeft: {
      flex: 1,
      ...AppStyles.centerAligned,
      backgroundColor: 'white',
   },
   wrapperIcDelete: {
      margin: 15,
      ...AppStyles.centerAligned,
      padding: 5,
   },
   icDelete: {
      width: Metrics.widthRatio(30),
      height: Metrics.widthRatio(30),
   },
   containerLoader: { flex: 1, ...AppStyles.alignItemsCenter },
};
