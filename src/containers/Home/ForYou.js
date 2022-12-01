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

if (Platform.OS === 'android') {
   if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
   }
}
const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
const name = "ForYouHome"

const ForYou = (props) => {

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

   useEffect(() => {
      if (params?.post) {
         animate()
         setState({ visible: true, newPost: params.post }) // post list requires ids only

         setTimeout(() => {
            animate()
            setState({ visible: false })
         }, 3000)
      }
   }, [params?.post])

   const getAllPosts = (isConcat, params, cbOnSuccess, cbOnFailure) => {
      let _payload = {
         ...params,
         check_post_type: 'foryou',
         // user_id: params?.user.id
      }
      getPosts(
         isConcat,
         _payload,
         cbOnSuccess,
         cbOnFailure,
      )
   }

   return (
      <View style={AppStyles.flex}>
         {state.visible && <PostAddedDialog />}
         <PostList
            fetchRequest={getAllPosts}
            emptyListMessage={"No post available"}
            name={params.name}
            isTiktok={params.isTiktok}
            newPost={state.newPost}
         />
      </View>
   );
};

export default ForYou;
