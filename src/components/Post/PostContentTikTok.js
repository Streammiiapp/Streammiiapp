import React, { memo, useContext } from 'react'
import { View, Text, FlatList } from 'react-native'
import { PostContext } from '../../contexts'
import { AudioPlayer, VideoPlayer } from '../../reuseableComponents'
import { Paragraph } from '../../reuseableComponents/Typography'
import { AppStyles, Colors, Fonts } from '../../theme'
import utility from '../../utility'
import PostDetails from './PostDetails'
import styles from './styles'
import SupportContent from './SupportContent'
import Title from '../../reuseableComponents/Typography/Title';
import { navigate, push } from '../../services/NavigationService'
import { getLoggedInUser } from '../../reuseableFunctions'

const PostContentTikTok = (props) => {
   const loggedInUser = getLoggedInUser()

   const { onShowReacted, onShowComments, onPostOptions, name, } = props
   const {
      id, post_type, media_file, media_thumbnail_url,
      total_like, total_dislike, total_comment,
      title, supportValue, post_tagusers, userCoinSupport_data, isTiktok
   } = useContext(PostContext)

   // const TagFilter = (item, index) => ev => {
   //    let singleTag = post_tagusers.filter((tag) => tag.name === item);
   //    global.log("singleTag", singleTag);
   //    // push('OtherProfile', { userSlug: singleTag[0].slug })
   //    if (loggedInUser.id == singleTag[0].id) {
   //       navigate('Profile')
   //    } else {
   //       push('OtherProfile', { userSlug: singleTag[0].slug })
   //    }
   // }



   // const _renderItem = ({ item, index }) => {
   //    return (
   //       <Title
   //          onPress={TagFilter(item, index)}
   //          style={[styles.tikToktxtTags, { ...Fonts.Regular(12), color: "#73C2FB" }]}
   //          size={12} >
   //          {/* {'haha'} */}
   //          {`@${item} `}
   //       </Title>
   //    )
   // }

   // const renderPostMessage = () => {
   //    if (utility.isEmpty(title)) return null
   //    let tags = post_tagusers.map(item => item.name);
   //    var myVar1 = tags.join('  ' + '@')
   //    return (
   //       <>
   //          {post_type != 'support' &&
   //             <Paragraph
   //                size={13}
   //                color={Colors.white}
   //                style={styles.tikTokMessage}>
   //                {title}
   //             </Paragraph>}
   //          {myVar1 ?
   //             <FlatList
   //                data={tags}
   //                renderItem={_renderItem}
   //                numColumns={3}
   //                style={{}}
   //                keyExtractor={(item) => item.id + ''}
   //             />

   //             : null
   //          }
   //       </>
   //    )
   // }

   const renderContent = () => {

      switch (post_type) {
         case 'video':
            return (
               <VideoPlayer
                  id={id}
                  name={name}
                  source={media_file}
                  poster={media_thumbnail_url}
               />
            );
         case 'audio':
            return (
               <AudioPlayer
                  id={id}
                  name={name}
                  source={media_file}
                  style={styles.contentMargin}
               />
            );
         case 'support':
            return (
               <SupportContent
                  id={id}
                  onPostOptions={onPostOptions}
                  // token={supportValue}
                  // sender={userCoinSupport_data}
                  // receiver={userCoinSupport_data}
                  userCoinSupport_data={userCoinSupport_data}
                  style={styles.contentMargin}
               />
            );
         default:
            return <View />
      }
   }

   return (
      <View style={styles.contentContainer}>
         {/* {renderPostMessage()} */}
         <View style={styles.contentWrapper}>
            {renderContent()}
         </View>
         {/* <PostDetails
            likes={total_like}
            dislikes={total_dislike}
            comments={total_comment}
            onShowReacted={onShowReacted}
            onShowComments={onShowComments}
         /> */}
      </View>
   )
}



export default PostContentTikTok
