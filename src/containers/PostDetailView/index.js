import React, { useEffect } from 'react'
import { View } from 'react-native'
import { getPosts, getSigalPosts } from '../../CommonApis'
import { PostList } from '../../components'
import { loggedInUser, myPosts, supportPosts } from '../../data'
import { isFan, pauseVideo } from '../../reuseableFunctions'
import { AppStyles } from '../../theme'
import { USER_TYPES } from '../../theme/String'

const name = "homePosts"

const PostDetailView = (props) => {

   const {
      navigation,
      route: { params }
   } = props

   useEffect(() => {

      const unsubBlur = navigation.addListener('blur', () => {
         pauseVideo(name)
      });

      return unsubBlur

   }, [])

   const getMyPosts = (isConcat, payload, cbOnSuccess, cbOnFailure) => {

      let _payload = { ...payload, post_id: params._id }

      getSigalPosts(
         isConcat,
         _payload,
         cbOnSuccess,
         cbOnFailure
      )
   }

   return (
      <View style={AppStyles.flex}>
         <PostList
            fetchRequest={getMyPosts}
            name={'homePosts'}
         />
      </View>
   )
}

export default PostDetailView



// import _ from 'lodash';
// import React, { memo, useCallback, useEffect, useRef } from 'react';
// import { View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { request } from '../../actions/ServiceAction';
// import { like as likeApi, dislike as dislikeApi } from '../../CommonApis';
// import { Post } from '../../components';
// import constant from '../../constants';
// import { useMergeState } from '../../hooks';
// import { FlatListHandler } from '../../reuseableComponents';
// import {
//    dislikeAPost,
//    getPostById,
//    likeAPost,
//    normalizePosts,
//    pauseVideo,
//    playVideo,
//    showBottomSheet,
//    subscribeBusEvent,
//    updateByIndex
// } from '../../reuseableFunctions';
// import { navigate } from '../../services/NavigationService';
// import { AppStyles } from '../../theme';
// // import { BS_CONTENT_TYPES, BUS_EVENTS, POST_TYPES } from '../../theme/String';

// const showComments = (postId) => () => {
//    navigate('Comments', { postId });
// };

// const showReacted = (postId) => () => {

//    const post = getPostById(postId);
//    navigate('Reacted', {
//       postId, likeCount: post.total_like,
//       dislikeCount: post.total_dislike
//    });
// };

// const showSupportUser = (postId) => () => {
//    navigate('Support');
// };

// const index = props => {

//    const loggedInUser = useSelector(({ user }) => user.data);

//    const [state, setState] = useMergeState({
//       posts: [],
//       isFetching: false,
//       meta: constant.serviceMeta,
//    });

//    const dispatch = useDispatch()

//    useEffect(() => {
//       fetchPosts()
//    }, []);

//    const fetchPosts = () => {
//       dispatch(
//          request(
//             constant.post + '/' + '21641902074',
//             constant.serviceTypes.GET,
//             null,
//             null,
//             true,
//             false,
//             cbOnSuccess,
//             cbOnFailure
//          )
//       )
//    }

//    const cbOnSuccess = (posts, meta, isConcat) => {
//       console.log('posts', posts)
//       updateState({ posts: [posts], meta, isFetching: false })
//    }

//    const cbOnFailure = () => {
//       updateState({ isFetching: false })
//    }

//    const updateState = (state = {}) => {
//       setState(state);
//    };
//    const like = (postId) => () => {
//       likeAPost(postId)
//       likeApi({ module: 'posts', module_id: postId })
//    };

//    const dislike = (postId) => () => {
//       dislikeAPost(postId)
//       dislikeApi({ module: 'posts', module_id: postId })
//    };

//    const showPostOptions = (postId) => () => {

//       const post = getPostById(postId);

//       let height = 180;
//       if (post.user.id == loggedInUser.id && post.type == POST_TYPES.SUPPORT) {
//          height = 140;
//       }
//       showBottomSheet({
//          contentType: BS_CONTENT_TYPES.POST_PROFILE_OPTIONS,
//          data: post,
//          type: 'post',
//          height: height,
//       });
//    };

//    const _renderItem = useCallback(({ item, index }) => {
//       global.log("render item====>::", item);
//       return (
//          <Post
//             name={'homePosts'}
//             postId={item}
//          // onLike={like(item)}
//          // onDislike={dislike(item, index)}
//          // onComment={showComments(item)}
//          // onToken={showSupportUser(item, index)}
//          // onShowComments={showComments(item)}
//          // onShowReacted={showReacted(item)}
//          // onPostOptions={showPostOptions(item, index)}
//          />
//       );
//    }, []);


//    console.log('state.post', state.posts)
//    return (
//       <View style={AppStyles.flex}>

//          <FlatListHandler
//             // {...props}
//             data={state.posts}
//             extraData={state.posts}
//             renderItem={_renderItem}
//             fetchRequest={fetchPosts}
//             meta={state.meta}
//             isFetching={state.isFetching}
//             overScrollMode="never"
//          // viewabilityConfig={VIEWABILITY_CONFIG}
//          // onViewableItemsChanged={onViewableItemsChanged.current}
//          />
//       </View>
//    );
// };

// // const propsAreEqual = (prevProps, nextProps) => {

// //    if (prevProps.newPost !== nextProps.newPost) {
// //       return false
// //    }

// //    return true
// // }

// export default index;

