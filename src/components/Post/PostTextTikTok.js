import React, { memo, useContext, useState } from 'react'
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

const PostTextTikTok = (props) => {
   const loggedInUser = getLoggedInUser()
   const [visible, setVisible] = useState(false)
   const { onShowReacted, onShowComments, onPostOptions, name, } = props
   const {
      id, post_type, media_file, media_thumbnail_url,
      total_like, total_dislike, total_comment,
      title, supportValue, post_tagusers, userCoinSupport_data, isTiktok
   } = useContext(PostContext)

   const TagFilter = (item, index) => ev => {
      let singleTag = post_tagusers.filter((tag) => tag.name === item);
      // push('OtherProfile', { userSlug: singleTag[0].slug })
      if (loggedInUser.id == singleTag[0].id) {
         navigate('Profile')
      } else {
         push('OtherProfile', { userSlug: singleTag[0].slug })
      }
   }



   const _renderItem = ({ item, index }) => {
      return (
         <View style={{ flex: 1, margin: 3 }}>
            <Title
               onPress={TagFilter(item, index)}
               numberOfLines={2}
               style={[{ ...Fonts.Regular(10), color: "#73C2FB" }]}
               size={13} >
               {/* {'haha'} */}
               {`@${item} `}
            </Title>
         </View>
      )
   }

   const renderPostMessage = () => {
      if (utility.isEmpty(title)) return null
      let tags = post_tagusers.map(item => item.name);
      var myVar1 = tags.join(' ' + '@')
      var limitTag = tags.slice(0, 2);
      return (

         <View style={{
            position: 'absolute',
            bottom: 30,
            zIndex: 999,
         }}>


            {post_type != 'support' &&
               <>
                  <Paragraph
                     size={13}
                     color={Colors.white}
                     onPress={() => setVisible(!visible)}
                     // numberOfLines={visible ? null : 1}
                     style={styles.tikTokMessage}>
                     {visible ? null : title.substring(0, 20) + "...."}
                  </Paragraph>

                  <Paragraph
                     size={13}
                     color={Colors.white}
                     onPress={() => setVisible(!visible)}
                     numberOfLines={visible ? null : 1}
                     style={styles.tikTokMessage}>
                     {visible ? title : null}
                  </Paragraph>
               </>}
            {myVar1 ?
               <FlatList
                  data={visible ? tags : []}
                  renderItem={_renderItem}
                  numColumns={5}
                  style={{ margin: 10 }}
                  keyExtractor={(item) => item.id + ''}
               />

               : null
            }
         </View>
      )
   }

   // const renderContent = () => {

   //    switch (post_type) {
   //       case 'video':
   //          return (
   //             <VideoPlayer
   //                id={id}
   //                name={name}
   //                source={media_file}
   //                poster={media_thumbnail_url}
   //             />
   //          );
   //       case 'audio':
   //          return (
   //             <AudioPlayer
   //                id={id}
   //                name={name}
   //                source={media_file}
   //                style={styles.contentMargin}
   //             />
   //          );
   //       case 'support':
   //          return (
   //             <SupportContent
   //                id={id}
   //                onPostOptions={onPostOptions}
   //                // token={supportValue}
   //                // sender={userCoinSupport_data}
   //                // receiver={userCoinSupport_data}
   //                userCoinSupport_data={userCoinSupport_data}
   //                style={styles.contentMargin}
   //             />
   //          );
   //       default:
   //          return <View />
   //    }
   // }

   return (
      <View style={styles.contentContainer}>
         {renderPostMessage()}
         {/* <View style={styles.contentWrapper}>
            {renderContent()}
         </View> */}
         <PostDetails
            likes={total_like}
            dislikes={total_dislike}
            comments={total_comment}
            onShowReacted={onShowReacted}
            onShowComments={onShowComments}
         />
      </View>
   )
}



export default PostTextTikTok
