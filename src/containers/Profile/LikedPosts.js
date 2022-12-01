import React, { useEffect } from 'react'
import { View } from 'react-native'
import { getPosts } from '../../CommonApis'
import { PostList } from '../../components'
import { pauseVideo } from '../../reuseableFunctions'
import { AppStyles } from '../../theme'

const LikedPosts = (props) => {

   const { navigation,
      route: { params }
   } = props

   useEffect(() => {

      const unsubBlur = navigation.addListener('blur', () => {
         pauseVideo(params.name)
      });

      return unsubBlur

   }, [])

   const getTaggedPosts = (isConcat, payload, cbOnSuccess, cbOnFailure) => {
      let _payload = {
         ...payload,
         check_post_type: 'like_user_post',
         user_id: params?.user.id
      }
      getPosts(
         isConcat,
         _payload,
         cbOnSuccess,
         cbOnFailure
      )
   }

   return (
      <View style={AppStyles.flex}>
         <PostList
            fetchRequest={getTaggedPosts}
            emptyListMessage={"When people likes your post, they'll appear here"}
            name={params.name}
         />
      </View>
   )
}

export default LikedPosts
