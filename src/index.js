import _ from 'lodash';
import React, { Component, createRef } from "react";
import { StatusBar, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-globalspinner";
import KeyboardManager from 'react-native-keyboard-manager';
import Reachability from "react-native-reachability-popup";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CreatePostModal, PostUploadModal } from "./components";
import constant from "./constants";
import { LoginContext } from './contexts';
import RootNavigator from "./navigator";
import { Alert, BottomSheet } from "./reuseableComponents";
import { deviceId, getNotificationCount, getOtherUser, setNotificatonCount } from "./reuseableFunctions";
import HttpServiceManager from "./services/HttpServiceManager";
import { navigate, navigatorRef } from "./services/NavigationService";
import singleton from "./singleton";
import { persistor, store } from "./store";
import { Colors } from "./theme";
import utility from "./utility";
import { getArtistTypes, getMusicTypes } from './CommonApis'
import OneSignal from 'react-native-onesignal';
import ImageViewerModal from './reuseableComponents/ImageViewer';
export default class App extends Component {

   constructor(props) {
      super(props);
      this.setLogin = this.setLogin.bind(this);
      this.postModalRef = createRef()
      this.state = {
         isLogin: false,
         setLogin: this.setLogin,
         isReduxLoaded: false,
         showPostModal: this.showPostModal,
         device_token: null
      }
   }
   componentDidMount() {



      HttpServiceManager.initialize(constant.baseURL, {
         token: deviceId()
      });

      //OneSignal Init Code
      OneSignal.setLocationShared(false);
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId('ae51b533-72d7-4ba8-a1f8-a9681b9a7241');
      OneSignal.setRequiresUserPrivacyConsent(false);
      OneSignal.promptForPushNotificationsWithUserResponse((response) => { });



      / O N E S I G N A L  H A N D L E R S /
      OneSignal.setNotificationWillShowInForegroundHandler(
         (notifReceivedEvent) => {
            let notification = notifReceivedEvent.getNotification();
            const { additionalData } = notification;

            if (additionalData.badge) {
               setNotificatonCount(additionalData.badge);
            }

         },
      );
      OneSignal.setNotificationOpenedHandler((noti) => {
         const { notification } = noti;
         setTimeout(
            () => this.onPressNotification(notification.additionalData),
            2000,
         );
      });
      //END OneSignal Init Code
      OneSignal.addSubscriptionObserver((event) => {
         const { userId } = event.to;
         utility.setOneSignalPlayerId(userId);
      });

      this.interval = setInterval(() => this.fetchDeviceState(), 5000);

      if (utility.isPlatformIOS()) {
         KeyboardManager.setEnable(true);
         KeyboardManager.setEnableAutoToolbar(true);
         KeyboardManager.setToolbarPreviousNextButtonEnable(true);
      }
   }

   fetchDeviceState = async () => {
      const { userId } = await OneSignal.getDeviceState();

      if (this.interval) {
         clearInterval(this.interval)
         utility.setOneSignalPlayerId(userId)
      }
      // userId && setState(s => ({...s, device_token: userId}));
   };


   componentWillUnmount() {
      OneSignal.clearHandlers();
   }

   onPressNotification = (notifObj) => {
      const { identifier, record_id, actor_id } = notifObj.custom_data;

      getNotificationCount();

      switch (identifier) {
         case "followers":
            // navigate('Followers');
            this.getTargetUser(actor_id, identifier, 'Followers')
            break;
         case "following":
            this.getTargetUser(actor_id, identifier, 'Following')
            // navigate('Following')
            break;
         case 'post_like':
            navigate('PostDetailView', { _id: record_id })
            break;
         case 'post_tag':
            navigate('PostDetailView', { _id: record_id })
            break;
         case "post_dislike":
            navigate('PostDetailView', { _id: record_id })
            break;
         case "post_comment":
            navigate('PostDetailView', { _id: record_id })
            break;
         case "accepted_follow_request":
            // navigate('Following')
            this.getTargetUser(actor_id, identifier, 'Following');
            break

         default:
            break;
      }

   };

   getTargetUser = (actor_id, identifier, route) => {
      getOtherUser(actor_id, (user) => {
         // navigate(route, { user });

         navigate('FollowersAndFollowing', { user: user })
      })

   }



   setLogin = (isLogin = true) => this.setState({ isLogin })


   showPostModal = () => {
      this.postModalRef.current.show()
   }

   onBeforeLift = () => {
      singleton.storeRef = store;

      getArtistTypes()
      getMusicTypes()

      const user = store.getState().user.data
      let isLogin = false;
      if (!_.isEmpty(user)) {
         isLogin = true
         HttpServiceManager.getInstance().userToken = user.api_token;
      }

      this.setState({
         isReduxLoaded: true,
         isLogin
      });
   };

   render() {

      const { isReduxLoaded } = this.state

      return (
         <Provider store={store}>

            <StatusBar
               barStyle="light-content"
               backgroundColor={Colors.greenishBlack}
            />

            <PersistGate
               onBeforeLift={this.onBeforeLift}
               persistor={persistor}>

               {
                  isReduxLoaded ?
                     <LoginContext.Provider value={this.state} >
                        <RootNavigator
                           ref={navigatorRef}
                        />
                     </LoginContext.Provider>
                     :
                     <View />
               }

            </PersistGate>

            <FlashMessage position="top" />

            <Spinner color={Colors.white} type='MaterialIndicator' size={36} />

            <Reachability />
            <ImageViewerModal ref={utility.setImageViewerRef} />

            <CreatePostModal
               ref={this.postModalRef}
            />

            <Alert />

            <BottomSheet />

            <PostUploadModal />
         </Provider>
      );
   }
}
