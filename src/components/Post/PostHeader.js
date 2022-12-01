import React, { useContext } from 'react'
import { View } from 'react-native'
import { PostContext } from '../../contexts'
import { Avatar, ButtonView, ImageButton, RoundButton } from '../../reuseableComponents'
import { Paragraph, Title } from '../../reuseableComponents/Typography'
import { navigate, push } from '../../services/NavigationService'
import { AppStyles, Colors, Fonts, Images } from '../../theme'
import styles from './styles'
import { getLoggedInUser, isFan } from '../../reuseableFunctions'
import utility from '../../utility'
import moment from 'moment';

const PostHeader = (props) => {

   const { onPostOptions } = props
   const { user, location, address, created_at, id, post_identify, isTiktok } = useContext(PostContext)
   const loggedInUser = getLoggedInUser()

   const showotherProfile = () => {
      if (user.id == loggedInUser.id) {
         navigate('Profile')
      } else {
         push('OtherProfile', { userSlug: user.slug })
      }

   }

   const onSupport = () => {
      navigate('SupportArtist', { user, id, isSupportArtist: true })
   }
   return (
      <ButtonView
         disableRipple={true}
         style={[styles.headerContainer, isTiktok == true && {
            position: 'absolute',
            top: 0,
            zIndex: 999,
         }]}
         onPress={showotherProfile}>
         <Avatar onPress={showotherProfile} source={{ uri: user.image_url }} size={36} />
         <View style={AppStyles.flex}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Title style={AppStyles.leftMargin10} numberOfLines={1}>
                  {user.name}
               </Title>
               {
                  user.username ?
                     <Title style={[AppStyles.leftMargin10, { ...Fonts.Regular(12), flex: post_identify == 'auto_generated_post' ? 1 : 0 }]} size={12} numberOfLines={1}>
                        {`@ ${user.username}`}
                     </Title> :
                     null
               }

            </View>
            {/* <Title style={AppStyles.leftMargin10} numberOfLines={1}>
               {user.name}
            </Title> */}
            {!utility.isEmpty(address) && address != "null" &&
               <Paragraph
                  size={12}
                  color={Colors.inactive}
                  style={AppStyles.leftMargin10}>
                  {address}
               </Paragraph>
            }
            <Title style={{ marginHorizontal: 5, marginVertical: 0, ...Fonts.Regular(12) }} size={12} numberOfLines={1}>
               {/* {`•  ${moment(created_at).format('MMM DD, h:mm')}`} */}
               {`•  ${moment(created_at).fromNow()}`}
            </Title>
         </View>
         {post_identify != 'auto_generated_post' ?
            <RoundButton
               title={'Support Artist'}
               style={styles.btnSupport}
               onPress={onSupport}
            />
            : null
         }
         <ImageButton
            source={Images.icVerticalDots}
            onPress={onPostOptions}
         />
      </ButtonView>
   )
}

export default PostHeader
