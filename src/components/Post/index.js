import React, { memo, useCallback } from 'react'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import { PostContext } from '../../contexts'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import _ from 'lodash'
import { Metrics } from '../../theme'
import { Text, View } from 'react-native'
import PostActionTikTok from './PostActionTikTok'
import PostContentTikTok from './PostContentTikTok'
import PostTextTikTok from './PostTextTikTok'

const postSelector = createSelector(
   (state) => state.generalPosts?.data,
   (_, postId) => postId,
   (posts, postId) => {
      return posts[postId]
   }
)

const index = (props) => {

   const {
      name,
      postId,
      onLike,
      onDislike,
      onComment,
      onToken,
      onPromote,
      onShowReacted,
      onShowComments,
      onPostOptions,
      isTiktok,
      height
   } = props

   // postSelector(state, postId)
   const post = useSelector(
      (state) => state.generalPosts?.data?.[postId],
      (prev, next) => _.isEqual(prev, next)
      // prev == next
   )
   if (!post) return null;
   return (
      <PostContext.Provider value={{ ...post, videoHeight: height, name, isTiktok }}>
         {
            post.type != 'support' &&

            <PostHeader
               onPostOptions={onPostOptions}
            />
         }
         <View style={{ flex: 1, justifyContent: 'center', alignItems: isTiktok == true && post.post_type != 'audio' ? 'center' : null }}>
            {isTiktok == true ?
               <PostContentTikTok
                  name={name}
                  onShowReacted={onShowReacted}
                  onShowComments={onShowComments}
                  onPostOptions={onPostOptions}
               />
               :
               <PostContent
                  name={name}
                  onShowReacted={onShowReacted}
                  onShowComments={onShowComments}
                  onPostOptions={onPostOptions}
               />
            }
         </View>
         {isTiktok == true ?
            <View style={{
               position: 'absolute',
               bottom: 10,
               zIndex: 999,
               width: '100%',
               // backgroundColor: 'pink'
            }}>

               <PostActionTikTok
                  onLike={onLike}
                  onDislike={onDislike}
                  onComment={onComment}
                  onPromote={onPromote}
                  onToken={onToken} />

               <PostTextTikTok
                  name={name}
                  onShowReacted={onShowReacted}
                  onShowComments={onShowComments}
                  onPostOptions={onPostOptions} />
            </View>
            :
            <PostActions
               onLike={onLike}
               onDislike={onDislike}
               onComment={onComment}
               onPromote={onPromote}
               onToken={onToken}
            />
         }
      </ PostContext.Provider>
   )
}

const propsAreEqual = (prevProps, nextProps) => _.isEqual(prevProps, nextProps)

export default memo(index, propsAreEqual)
