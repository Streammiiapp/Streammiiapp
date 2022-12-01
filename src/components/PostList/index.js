import _ from 'lodash';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { like as likeApi, dislike as dislikeApi } from '../../CommonApis';
import { Post } from '../../components';
import constant from '../../constants';
import { useMergeState } from '../../hooks';
import { FlatListHandler } from '../../reuseableComponents';
import {
   dislikeAPost,
   getPostById,
   likeAPost,
   normalizePosts,
   pauseVideo,
   playVideo,
   showBottomSheet,
   subscribeBusEvent,
   updateByIndex
} from '../../reuseableFunctions';
import { navigate, push } from '../../services/NavigationService';
import { AppStyles, Colors, Fonts, Metrics } from '../../theme';
import { BS_CONTENT_TYPES, BUS_EVENTS, POST_TYPES } from '../../theme/String';
import utility from '../../utility';
import Share from 'react-native-share';

const VIEWABILITY_CONFIG = {
   viewAreaCoveragePercentThreshold: 50,
}

const showComments = (postId) => () => {
   push('Comments', { postId });
};


const _onPromote = (postId) => () => {
   const post = getPostById(postId);

   const { user, id } = post
   navigate('SupportArtist', { user, id, isSupportArtist: false })
};

const showReacted = (postId) => () => {

   const post = getPostById(postId);
   navigate('Reacted', {
      postId, likeCount: post.total_like,
      dislikeCount: post.total_dislike
   });
};

const showSupportUser = (postId) => () => {
   navigate('Support');
};

const index = props => {

   const { name, fetchRequest, newPost, searching, tabName, isTiktok, ranking } = props;
   const mountRef = useRef(false);
   const stateRef = useRef();
   const lastViewableItemType = useRef(null);
   const lastVideoId = useRef(-1);
   const searchText = useRef('');
   const loggedInUser = useSelector(({ user }) => user.data);

   const [state, setState] = useMergeState({
      posts: [],
      isFetching: false,
      meta: constant.serviceMeta,
      height: 0
   });

   const calcHeight = useRef(0);

   useEffect(async () => {
      if (newPost) {
         const posts = _.concat(newPost.id, state.posts)
         await updateState({ posts });

         if (newPost.post_type == 'video') {
            _playVideo(newPost)
         }
      }
   }, [newPost]);

   useEffect(() => {

      subscribeBusEvent(BUS_EVENTS.POST_DELETE, cbOnPostDelete)

      if (searching) {
         subscribeBusEvent(BUS_EVENTS.SEARCH_TEXT_CHANGE, ({ text, activeTab, isAddingCategoriesToSearch }) => {
            if (isAddingCategoriesToSearch && props.name == "searchGenre") {
               fetchPosts()
            } else
               cbOnSearch({ text, activeTab })
         })
      } else {
         fetchPosts()
      }

      if (!mountRef.current) {
         mountRef.current = true;
      }

      return () => {
         mountRef.current = false;
      };
   }, []);

   useEffect(() => {
      stateRef.current = state;
   }, [state]);

   const updateState = (state = {}) => {
      if (mountRef.current) {
         setState(state);
      }
   };

   const fetchPosts = (isConcat = false, params = {}) => {

      let _params = { ...params, screen_name: 'default' }
      if (searching) {
         _params = { ...params, screen_name: 'search', keyword: searchText.current, media_type: tabName }
      }

      if (fetchRequest) {
         setState({ isFetching: true })
         fetchRequest(
            isConcat,
            _params,
            (posts, meta) => cbOnSuccess(posts, meta, isConcat),
            cbOnFailure
         )
      }
   }

   const cbOnSuccess = (posts, meta, isConcat) => {
      if (!posts.length) {
         if (!isConcat) {
            updateState({ posts: [], isFetching: false })
         } else {
            updateState({ isFetching: false })
         }
         return
      }

      let _posts = state.posts
      const postIds = normalizePosts(posts)

      if (isConcat) {
         _posts = _.concat(_posts, postIds)
      } else {

         _posts = postIds
      }

      updateState({ posts: _posts, meta, isFetching: false })
   }

   const cbOnFailure = () => {
      updateState({ isFetching: false })
   }

   const cbOnSearch = ({ text, activeTab }) => {
      if (activeTab == tabName && searchText.current != text) {
         searchText.current = text
         fetchPosts()
      }
   }

   const cbOnPostDelete = (id) => {

      let newIds = [...stateRef.current.posts];
      const index = newIds.indexOf(id);
      if (index > -1) {
         newIds.splice(index, 1);
         updateState({ posts: newIds });
      }
   }

   const like = (postId) => () => {
      likeAPost(postId)
      likeApi({ module: 'posts', module_id: postId })
   };

   const dislike = (postId) => () => {
      dislikeAPost(postId)
      dislikeApi({ module: 'posts', module_id: postId })
   };

   const showPostOptions = (postId) => () => {

      const post = getPostById(postId);

      let height = 220;
      if (post.user.id == loggedInUser.id && post.type == POST_TYPES.SUPPORT) {
         height = 180;
      }
      showBottomSheet({
         contentType: BS_CONTENT_TYPES.POST_PROFILE_OPTIONS,
         data: post,
         type: 'post',
         height: height,
      });
   };

   const _playVideo = useCallback((post) => {
      playVideo(name, post.id, lastVideoId.current)
      lastViewableItemType.current = 'video';
      lastVideoId.current = post.id;
   }, [])

   const _pauseVideo = useCallback(() => {
      pauseVideo(name, lastVideoId.current);
      lastViewableItemType.current = 'other';
      lastVideoId.current = -1;
   }, [])

   const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {

      const data = viewableItems?.length ? viewableItems[0] : null;

      if (!data) return;

      const post = getPostById(data.item)
      if (post) {
         if (post.post_type === 'video' && lastVideoId.current != post.id) {
            _playVideo(post)
         } else if (lastViewableItemType.current == 'video' && post.post_type != 'video') {
            _pauseVideo()
         }
      }
   });


   const _renderItem = useCallback(({ item, index }) => {


      return (
         <View style={{ height: isTiktok == true ? calcHeight.current : null, width: isTiktok == true ? Metrics.screenWidth : null, }}>

            <Post
               name={name}
               postId={item}
               onLike={like(item)}
               onDislike={dislike(item, index)}
               onComment={showComments(item)}
               onPromote={_onPromote(item)}
               onToken={showSupportUser(item, index)}
               onShowComments={showComments(item)}
               onShowReacted={showReacted(item)}
               onPostOptions={showPostOptions(item, index)}
               isTiktok={isTiktok}
               height={calcHeight.current}
            />
            {ranking == true ?
               <LoadAnimation index={index} calcHeight />
               : null}
         </View>
      );
   }, []);

   return (
      <View style={AppStyles.flex} onLayout={(e) => {
         calcHeight.current = e.nativeEvent.layout.height;
         setState({ height: e.nativeEvent.layout.height })
      }}>
         {!!state.height && <FlatListHandler
            // {...props}
            data={state.posts}
            extraData={state.posts}
            emptyListMessage={props.emptyListMessage}
            renderItem={_renderItem}
            fetchRequest={fetchPosts}
            pagingEnabled={isTiktok == true ? true : false}
            meta={state.meta}
            isFetching={state.isFetching}
            overScrollMode="never"
            viewabilityConfig={VIEWABILITY_CONFIG}
            onViewableItemsChanged={onViewableItemsChanged.current}
         // onMomentumScrollEnd={onScrollEnd}
         />}
      </View>
   );
};

const propsAreEqual = (prevProps, nextProps) => {

   if (prevProps.newPost !== nextProps.newPost) {
      return false
   }

   return true
}

const LoadAnimation = ({ index, calcHeight }) => {
   // const fadeAnim = new Animated.Value(1)

   // const fadeOut = () => {
   //    // Will change fadeAnim value to 0 in 3 seconds
   //    Animated.timing(fadeAnim, {
   //       toValue: 0,
   //       duration: 2000,
   //       useNativeDriver: true
   //    }).start();
   // };
   // useEffect(() => {
   //    fadeAnim.setValue(1)
   //    fadeOut()
   // })
   return (
      <>
         <Animated.View
            style={{
               // Bind opacity to animated value
               height: calcHeight.current,
               width: '100%',
               position: "absolute",
               zIndex: 998,
               // top: 0,
               bottom: 10,
               right: 0,
               left: 0,
               // opacity: fadeAnim,
               justifyContent: 'center',
               alignItems: 'center',
               // backgroundColor: 'red'
            }
            }
         >
            <View style={{
               height: 70,
               width: 70,
               backgroundColor: 'rgba(10, 148, 255, 0.2)',
               justifyContent: 'center',
               alignItems: 'center',
               borderRadius: 50 / 2
            }}>
               <Text style={{
                  ...Fonts.Light(40),
               }}>{index + 1}</Text>
            </View>
         </Animated.View>
      </>
   )
}
export default memo(index, propsAreEqual)

