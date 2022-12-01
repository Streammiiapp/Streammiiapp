import React, { useCallback, useRef, memo } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import { Avatar, ButtonView, Chip, RoundButton, Separator } from '../../reuseableComponents';
import { AppStyles, Colors, Images, Metrics } from '../../theme';
import { Paragraph } from '../../reuseableComponents/Typography';
import { USER_LIST_TYPES } from '../../theme/String'
import { useMergeState } from '../../hooks';
import _ from 'lodash'
import utility from '../../utility';
import { getLoggedInUser } from '../../reuseableFunctions';

const {
   DEFAULT,
   FOLLOW,
   FOLLOWERS,
   FOLLOWING,
   FOLLOW_REQUEST,
   REACTED,
   BLOCKED,
   SELECTION,
   SEARCH_ARTIST

} = USER_LIST_TYPES

const index = props => {

   const {
      user, style,
      disabled, onPress,
      listType, isSelected,
      onFollow,
      onUnblock,
      onRemoveFollower,
      onRemoveFollowing,
      onConfirmFollowReq,
      onCancelFollowReq,
      OtherId
   } = props;
   const loggedInUser = getLoggedInUser()
   const [state, setState] = useMergeState({
      isFollowing: false,
   })

   const renderRight = () => {
      switch (listType) {
         case SELECTION:
            return (
               isSelected ? <Image source={Images.icSelected} /> : null
            )
         case FOLLOW:
            return (
               <RoundButton
                  title={utility.isEqual(user.following, '1') ? 'Following' : 'Follow'}
                  outlined={utility.isEqual(user.following, '1') ? true : false}
                  onPress={onFollow}
               />
            )
         case FOLLOWERS:
            return (
               (loggedInUser.id === OtherId ?
                  <RoundButton
                     title={'Remove'}
                     outlined={true}
                     onPress={onRemoveFollower}
                  />
                  : null)
            )
         case FOLLOWING:
            return (
               (loggedInUser.id === OtherId ?
                  <RoundButton
                     title={'Following'}
                     outlined={true}
                     onPress={onRemoveFollowing}
                  />
                  : null)
            )
         case BLOCKED:
            return (
               <RoundButton
                  title={'Unblock'}
                  outlined={true}
                  onPress={onUnblock}
               />
            )
         case FOLLOW_REQUEST:
            return (
               <>
                  <RoundButton title={'Accept'} outlined={false} onPress={onConfirmFollowReq} />
                  <RoundButton
                     title={'Cancel'}
                     style={{ marginLeft: Metrics.smallMargin }}
                     outlined={true}
                     onPress={onCancelFollowReq}
                  />
               </>
            )
         case SEARCH_ARTIST:
            return (
               <>
                  <Chip
                     bordered
                     title={user.artist_type?.title ?? 'Fan'}
                  />
               </>
            )
         case REACTED:
         case DEFAULT:
         default:
            return null;
      }
   }

   return (
      <ButtonView onPress={onPress} disabled={disabled} style={style}>
         <View style={styles.wrapper}>
            <Avatar source={{ uri: user.image_url }} size={34} disabled={true} />
            {listType === "search_artist" ?
               <View style={[AppStyles.flex, AppStyles.hBaseMargin]}>
                  <Paragraph
                     numberOfLines={1}
                     size={14}
                     color={Colors.white}
                     style={[AppStyles.flex]}>
                     {user.name}
                  </Paragraph>
                  <Paragraph
                     numberOfLines={1}
                     size={14}
                     color={Colors.disable}
                     style={[AppStyles.flex]}>
                     {"@" + user.username}
                  </Paragraph>
               </View>
               :
               <Paragraph
                  numberOfLines={1}
                  size={14}
                  color={Colors.white}
                  style={[AppStyles.flex, AppStyles.hBaseMargin]}>
                  {user.name}
               </Paragraph>}
            {renderRight()}
         </View>
         <Separator />
      </ButtonView>
   );
};

index.defaultProps = {
   disabled: true,
   listType: DEFAULT,
   schema: {
      title: 'name',
   },
};

const propsAreEqual = (prevProps, nextProps) => _.isEqual(prevProps, nextProps)

export default memo(index, propsAreEqual);
