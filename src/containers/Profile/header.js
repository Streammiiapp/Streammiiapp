import { PhoneNumberUtil } from "google-libphonenumber"
import React, { memo, useEffect, useRef, useState } from 'react'
import { Image, Linking, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { deleteFollowRequest, followUser } from '../../CommonApis'
import { Avatar, ButtonView, Chip, ImageButton, RoundButton } from '../../reuseableComponents'
import { Paragraph, Text, Title } from '../../reuseableComponents/Typography'
import { navigate, push } from '../../services/NavigationService'
import { AppStyles, Colors, Images } from '../../theme'
import { SOCIAL_TYPES, USER_TYPES } from '../../theme/String'
import utility from '../../utility'
import styles from './styles'

const phoneUtil = PhoneNumberUtil.getInstance();

const Header = (props) => {

   const { profileType } = props
   const [user, setUser] = useState(props.user)
   const loggedInUser = useSelector(({ user }) => user.data);
   const mountRef = useRef(false);

   useEffect(() => {
      if (!mountRef.current) {
         mountRef.current = true;
      }

      return () => {
         mountRef.current = false;
      };
   }, [])

   useEffect(() => {
      if (mountRef.current && props.user) {
         setUser(props.user)
      }
   }, [props.user])

   const _isFan = user?.user_type == USER_TYPES.FAN.id

   const editProfile = () => {
      const code = 'US'
      if (!utility.isEmpty(user.mobile_no)) {
         phoneUtil.getRegionCodeForNumber(phoneUtil.parse(user.mobile_no))
      }

      navigate('EditProfile', { countryCode: code })
   }
   const collaboration = () => {
      navigate('ChatRoom', { otherUser: user })
   }

   const renderCountsSeparator = () => {
      return (
         <Image source={Images.icDotsSeparator} />
      )
   }

   const renderCounts = (count = 0, type, onPress) => {
      return (
         <ButtonView style={styles.countContainer} onPress={onPress}>
            <Text style={styles.countText}>
               {count}
            </Text>
            <Paragraph color={Colors.white}>
               {type}
            </Paragraph>
         </ButtonView>
      )
   }


   const onSocialPress = async (url) => {

      const canOpen = Linking.canOpenURL(url)
      if (canOpen) {
         try {
            await Linking.openURL(url)
         } catch (error) {
            global.log({ error });
         }
      }
   }

   const showFollowersFollowing = () => {
      push('FollowersAndFollowing', { user: user })
   }

   const onFollow = () => {

      if (utility.isEqual(user.following, '1')) {
         deleteFollowRequest(user.id, cbOnFollowSuccess)
      } else if (utility.isEqual(user.following, '0')) {
         followUser(
            {
               actor_id: loggedInUser.id,
               target_id: user.id,
               status: 1
            },
            cbOnFollowSuccess
         )
      }
   }

   const cbOnFollowSuccess = (user) => {
      setUser(user)
   }

   const renderSocials = () => {

      let social_acc = []
      SOCIAL_TYPES.forEach((type) => {
         if (!utility.isEmpty(user[type.key])) {
            social_acc.push({ ...type, url: user[type.key] })
         }
      });

      return (
         <View style={styles.socialContainer}>
            <View style={AppStyles.flexRow}>
               {
                  social_acc?.map((acc) => (
                     <ImageButton
                        key={acc.key}
                        source={acc?.image}
                        imageStyle={styles.socialIcon}
                        onPress={() => onSocialPress(acc.url)}
                     />
                  ))
               }
            </View>
            {/* {!_isFan && */}
            <Chip
               bordered
               title={user.artist_type?.title ?? 'Fan'}
            />
            {/* } */}
         </View>
      )
   }

   const onMessagePress = () => {
      navigate('ChatRoom', { otherUser: user })
   }

   const renderButtons = () => {
      return (
         <View style={AppStyles.flexRow}>
            {
               profileType == 'own' ?
                  <RoundButton
                     title='Edit Profile'
                     style={styles.button}
                     onPress={editProfile}
                  />
                  :
                  <>
                     <RoundButton
                        title={utility.isEqual(user.following, '2') ? 'Requested' : utility.isEqual(user.following, '1') ? 'Following' : 'Follow'}
                        outlined={utility.isEqual(user.following, '2') ? true : false}
                        style={[styles.button, { marginRight: 8 }]}
                        onPress={onFollow}
                     />
                     {
                        loggedInUser?.user_type === "artist"
                        && user?.user_type !== "fan" &&
                        <RoundButton
                           title='Message'
                           style={styles.button}
                           onPress={onMessagePress}
                        />
                     }
                  </>
            }
         </View>
      )
   }
   return (
      <View style={styles.headerContainer}>
         {user &&
            <>
               <View style={AppStyles.flexRow}>
                  <Avatar size={58} source={{ uri: user?.image_url }} disabled={true} cache />
                  <View style={styles.countWrapper}>
                     <View style={styles.counts}>
                        {renderCounts(user.total_post, 'Post')}
                        {renderCountsSeparator()}
                        {renderCounts(user.no_of_followers, 'Followers', showFollowersFollowing)}
                        {renderCountsSeparator()}
                        {renderCounts(user.no_of_following, 'Following', showFollowersFollowing)}
                     </View>
                     {renderButtons()}
                  </View>
               </View>
               <View style={styles.nameContainer}>
                  <View>
                     <Title>
                        {user.name}
                     </Title>
                     <Paragraph>
                        {`@${user.username}`}
                     </Paragraph>
                  </View>
                  {loggedInUser?.id === user?.id ?
                     <Chip
                        bordered={_isFan ? false : true}
                        image={Images.icDollar}
                        title={_isFan ? `${user.no_of_token_supported} Tokens` : user.no_of_token_received}
                        style={[AppStyles.hBaseMargin,
                        { backgroundColor: _isFan ? Colors.greenishBlack : Colors.darkGrey }
                        ]}
                     />
                     : null}

                  {
                     user?.id != loggedInUser?.id &&
                     loggedInUser?.user_type === "artist"
                     && user?.user_type !== "fan" &&
                     <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <TouchableOpacity
                           style={{
                              backgroundColor: Colors.theme,
                              height: 30,
                              width: 30,
                              borderRadius: 30 / 2,
                              justifyContent: 'center',
                              alignItems: 'center'
                           }}
                           onPress={collaboration}
                        >
                           <Image
                              source={Images.icCollab}
                              style={{ tintColor: 'white' }}
                           />
                        </TouchableOpacity>
                     </View>
                  }

               </View>

               {
                  user.bio !== 'null' ?
                     <Paragraph color={Colors.white}>
                        {user.bio}
                     </Paragraph> : null
               }


               {
                  !_isFan && user.music_genre &&

                  <View style={{ marginTop: 12 }}><Paragraph color={Colors.white}>
                     {`Genre: ${user.music_genre.title}`}
                  </Paragraph></View>
               }

               {renderSocials()}
            </>
         }
      </View>
   )
}

export default Header
