import React, { memo, useContext } from 'react';
import { View, Text } from 'react-native';
import { AppStyles, Colors, Images, Metrics } from '../../theme';
import styles from './styles';
import { TextImageButton } from '../../reuseableComponents';
import { PostContext } from '../../contexts';
// import { loggedInUser } from '../../data';
import { getLoggedInUser } from '../../reuseableFunctions';

const btnWidth = Metrics.screenWidth / 4;
const PostActionTikTok = props => {
   const { onLike, onDislike, onComment, onToken, onPromote } = props;
   const { is_user_like, is_user_dislike, total_token, type, user, support_coin, post_identify, isTiktok } = useContext(PostContext);

   const likeStyle = is_user_like
      ? {
         source: Images.icLiked,
         titleColor: Colors.like,
      }
      : {
         source: Images.icUnliked,
         titleColor: Colors.inactive,
      };

   const dislikeStyle = is_user_dislike
      ? {
         source: Images.icDisliked,
         titleColor: Colors.dislike,
      }
      : {
         source: Images.icUnDisliked,
         titleColor: Colors.inactive,
      };

   const loggedInUser = getLoggedInUser()
   const showSupportUser = user.id == loggedInUser.id;



   const showPromoteBtn = user.id == loggedInUser.id

   return (
      <View style={styles.tikTokActionsContainer}>
         <View style={{
            alignItems: 'flex-start',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 10
         }}>
            <TextImageButton
               onPress={onLike}
               // title="Like"
               disabled={false}
               {...likeStyle}
               style={styles.growOne}
            />
            <TextImageButton
               onPress={onDislike}
               // title="Dislike"
               disabled={false}
               {...dislikeStyle}
               style={styles.growOne}
            />
            {/* <TextImageButton
               onPress={onComment}
               // title="Comment"
               disabled={false}
               source={Images.icComment}
               titleColor={Colors.inactive}
               style={styles.growOne}
            /> */}
            {post_identify != 'auto_generated_post' && showPromoteBtn && (
               <TextImageButton
                  onPress={onPromote}
                  // title="Promote"
                  disabled={false}
                  source={Images.icPromote}
                  titleColor={Colors.inactive}
                  style={styles.growOne}
               />
            )}
            {post_identify != 'auto_generated_post' && (
               <TextImageButton
                  onPress={onToken}
                  title={`${support_coin}`}
                  // disabled={!showSupportUser}
                  disabled={true}
                  source={Images.icToken}
                  titleColor={Colors.token}
                  style={styles.growOne}
               />
            )}
         </View>
      </View >
   );
};

export default PostActionTikTok;
