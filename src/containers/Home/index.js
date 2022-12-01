import React, { useContext, useEffect } from 'react'
import { LayoutAnimation, UIManager, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { HOME_POSTS, NORMALIZE_POSTS, USER_REPORT_OPTIONS } from '../../actions/ActionTypes'
import { success, request } from '../../actions/ServiceAction'
import constant from '../../constants'
import { getPosts } from '../../CommonApis'
import { PostAddedDialog, PostList } from '../../components'
import { useMergeState } from '../../hooks'
import { getNotificationCount, hideSplash, pauseAudio, pauseVideo } from '../../reuseableFunctions'
import { AppStyles } from '../../theme'
import { LoginContext } from '../../contexts'
import SocketIO from '../../modules/SocketIO/index'
import { navigate } from '../../services/NavigationService'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Following from './Following'
import { screenOptions, tabBarOptions } from './options'
import ForYou from './ForYou'
import Top25 from './Top25'

if (Platform.OS === 'android') {
   if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
   }
}
const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
const name = "homePosts"
const Tab = createMaterialTopTabNavigator();

const index = (props) => {

   const { navigation, route: { params } } = props
   const dispatch = useDispatch();
   const user = useSelector(({ user }) => user.data)
   const { setLogin } = useContext(LoginContext)

   const [state, setState] = useMergeState({
      visible: false,
      newPost: null
   })

   useEffect(() => {
      SocketIO.init(user);
      if (!SocketIO.getInstance().getIsReceivedMessageListenerLockStatus()) {
         SocketIO.connectToSocket(user);
      }

      dispatch(
         request(
            constant.reportOptions,
            constant.serviceTypes.GET,
            null,
            USER_REPORT_OPTIONS,
            false,
            false,
         )
      )

      hideSplash()
      const unsubBlur = navigation.addListener('blur', () => {
         pauseVideo(name)
         pauseAudio(name)
      });
      return unsubBlur

   }, []);

   useEffect(() => {
      getNotificationCount();
   }, [])

   useEffect(() => {
      if (!user) {
         setLogin(false);
      }
   }, [user])

   // useEffect(() => {
   //    if (params?.post) {
   //       global.log("params::", params);
   //       animate()
   //       setState({ visible: true, newPost: params.post }) // post list requires ids only

   //       setTimeout(() => {
   //          animate()
   //          setState({ visible: false })
   //       }, 3000)
   //    }
   // }, [params?.post])

   // const getAllPosts = (isConcat, params, cbOnSuccess, cbOnFailure) => {
   //    getPosts(
   //       isConcat,
   //       params,
   //       cbOnSuccess,
   //       cbOnFailure,
   //    )
   // }

   return (
      <View style={AppStyles.flex}>
         {/* {state.visible && <PostAddedDialog />} */}
         <Tab.Navigator
            lazy={true}
            // screenOptions={screenOptions}
            tabBarOptions={tabBarOptions}>
            <Tab.Screen
               name="FollowingHome"
               component={Following}
               initialParams={{
                  name: "FollowingHome",
               }}
               options={{
                  title: 'Following',
               }}
            />
            <Tab.Screen
               name="For You"
               component={ForYou}
               initialParams={{
                  name: "ForYouHome",
                  uniqueName: 'abc',
                  isTiktok: true
               }}
            />
            <Tab.Screen
               name="Top 25"
               component={Top25}
               initialParams={{
                  name: "Top25Home",
                  uniqueName: 'abc',
                  isTiktok: true
               }}
            />

         </Tab.Navigator>
      </View>
   );
};

export default index;
