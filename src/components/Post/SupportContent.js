import React, { useCallback, useRef } from 'react'
import { View, Text, Image } from 'react-native'
import { loggedInUser } from '../../data'
import { ImageButton } from '../../reuseableComponents'
import { Paragraph } from '../../reuseableComponents/Typography'
import { getLoggedInUser } from '../../reuseableFunctions'
import { navigate, push } from '../../services/NavigationService'
import { AppStyles, Colors, Images } from '../../theme'
import styles from './styles'

const SupportContent = (props) => {
   const loggedInUser = getLoggedInUser()

   const { style, sender, receiver, token, onPostOptions, userCoinSupport_data } = props

   const showPost = () => {
      navigate('PostDetailView', { _id: userCoinSupport_data?.reference_id })
   }

   const showArtistProfile = () => {
      push('OtherProfile', { userSlug: userCoinSupport_data?.reciever.slug })
   }

   const showFanProfile = () => {
      if (loggedInUser.id == userCoinSupport_data?.sender.id) {
         navigate('Profile')
      } else {
         push('OtherProfile', { userSlug: userCoinSupport_data?.sender.slug })
      }
   }

   return (
      <View style={[styles.supportContainer, style]}>
         <Image source={Images.coins} />
         <Paragraph style={styles.supportText}>
            <Paragraph color='white' onPress={showFanProfile}>
               {
                  loggedInUser.id == userCoinSupport_data?.sender.id ?
                     'You '
                     :
                     userCoinSupport_data?.sender.name + ' '
               }
            </Paragraph>
            Supported
            <Paragraph color='white' onPress={showArtistProfile}>
               {' ' + userCoinSupport_data?.reciever?.name + ' '}
            </Paragraph>
            with {userCoinSupport_data?.coins} tokens {' '}
            <Paragraph
               color={Colors.theme}
               onPress={showPost}>
               View Post
            </Paragraph>
         </Paragraph>
         {/* <ImageButton
            source={Images.icVerticalDots}
            onPress={onPostOptions}
         /> */}
      </View>
   )
}

export default SupportContent
