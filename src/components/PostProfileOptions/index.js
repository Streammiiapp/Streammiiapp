import React, {
   forwardRef,
   memo, useMemo
} from 'react';
import { StyleSheet, View } from 'react-native';
import { blockUser, deletePost } from '../../CommonApis';
import { loggedInUser } from '../../data';
import { Separator, TextButton } from '../../reuseableComponents';
import { closeAlert, closeBottomSheet, getLoggedInUser, publishBusEvent, showAlert, showBottomSheet } from '../../reuseableFunctions';
import { navigate } from '../../services/NavigationService';
import { Colors, Metrics } from "../../theme";
import { BS_CONTENT_TYPES, BUS_EVENTS, POST_TYPES } from '../../theme/String';
import Share from 'react-native-share';

const index = forwardRef((props, ref) => {

   const {
      onBlock, onReport,
      onEdit, onRemove,
      post, user, type
   } = props

   const isPost = type == 'post'

   const isMyPost = useMemo(() => isPost && post?.user?.id == getLoggedInUser()?.id, [post])

   const editPost = () => {
      closeBottomSheet()
      navigate('CreatePost', { post, postType: post.post_type })
   }
   const sharePost = () => {
      const options = {
         title: 'Share via',
         message: post?.media_file,
         url: post?.media_file,
      };

      Share.open(options)
         .then((res) => {
            console.log(res);
         })
         .catch((err) => {
            err && console.log(err);
            closeBottomSheet()
         });
      // navigate('CreatePost', { post, postType: post.post_type })
   }

   const showReportOptions = () => {
      closeBottomSheet()
      setTimeout(() => {
         showBottomSheet({
            contentType: BS_CONTENT_TYPES.REPORT_OPTIONS,
            height: 522
         })
      }, 500)
   }

   const confirmRemove = () => {
      closeBottomSheet()
      setTimeout(() => {
         showAlert({
            message: 'Are you sure you want to delete this post?',
            rightPressText: 'Yes, Remove',
            isRightNegative: true,
            onRightPress: removePost
         })
      }, 500)

   }

   const removePost = () => {
      closeAlert()
      deletePost(post.slug, () => {
         publishBusEvent(BUS_EVENTS.POST_DELETE, post.id)
      })

   }

   const confirmBlock = () => {
      closeBottomSheet()
      const name = isPost ? post?.user.name : user?.name

      setTimeout(() => {
         showAlert({
            message: `Are you sure you want to block “${name}”?`,
            canChoose: true,
            isRightNegative: true,
            onRightPress: block
         })
      }, 500)
   }

   const block = () => {
      const id = isPost ? post?.user.id : user?.id
      blockUser(id, null)
      closeAlert()
   }

   return (
      <View style={styles.container}>
         {
            isMyPost && post?.type == POST_TYPES.SUPPORT ? null :
               post?.post_identify != 'auto_generated_post' ?
                  <>
                     <TextButton
                        onPress={isMyPost ? editPost : showReportOptions}
                        style={styles.btn}
                        title={isMyPost ? 'Edit' : 'Report'}
                     />
                     <Separator color={Colors.inactive} />

                  </>
                  : null
         }
         <TextButton
            onPress={isMyPost ? confirmRemove : confirmBlock}
            style={styles.btn}
            title={isMyPost ? 'Remove' : 'Block'}
         />
         {post?.post_identify == 'auto_generated_post' ?
            <Separator color={Colors.inactive} /> : null}
         {type != 'user' &&
            <>
               <Separator color={Colors.inactive} />
               <TextButton
                  onPress={sharePost}
                  style={styles.btn}
                  title={"Share"}
               />
            </>
         }

      </View>
   )
})


const styles = StyleSheet.create({
   container: {
      paddingHorizontal: Metrics.baseMargin
   },
   btn: {
      alignItems: 'flex-start',
      paddingVertical: Metrics.heightRatio(18),
   }
})
export default memo(index)

