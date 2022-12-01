import React, { useCallback, useEffect } from 'react';
import { useMergeState } from '../../hooks';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
   Avatar,
   ButtonView,
   FlatListHandler,
   IconWithBadge,
   Separator,
} from '../../reuseableComponents';
import { Paragraph, Title } from '../../reuseableComponents/Typography';
import { AppStyles, Images, Colors, Fonts, Metrics } from '../../theme';
import styles from './styles';
import { notification } from '../../data';
import { navigate } from '../../services/NavigationService';
import { NotificationListCell } from '../../components';
import constant from '../../constants';
import { useDispatch } from 'react-redux';
import { defaultAction, request } from '../../actions/ServiceAction';
import { getOtherUser, getReadNotification, setNotificatonCount } from '../../reuseableFunctions'
import { NOTIFICATION } from '../../actions/ActionTypes';
import { useSelector } from 'react-redux';
import utility from '../../utility';
import { getUser } from '../../CommonApis/index';

const index = props => {
   const { } = props;
   const loggedInUser = useSelector(({ user }) => user.data);
   const notificationCount = useSelector((state) => state.notificationCount.data);

   const dispatch = useDispatch()

   const [state, setState] = useMergeState({
      notifications: [],
      isFetching: false,
      meta: constant.serviceMeta,
   });


   useEffect(() => {
      setNotificatonCount(0, notificationCount.request_count, notificationCount.message_counter);
   }, []);

   useEffect(() => {
      _getNotificationList()
   }, []);

   function _getNotificationList(isConcat = false, page = 1) {

      let params = {
         page
      }
      dispatch(
         request(
            constant.notification,
            constant.serviceTypes.GET,
            params,
            NOTIFICATION,
            false,
            isConcat,
            cbOnSuccess,
            cbOnFailure
         )
      )
   }

   const cbOnSuccess = (notifications, message, meta) => {
      // updateState({ notifications, meta, isFetching: false })
   }
   const cbOnFailure = () => { updateState({ isFetching: false }) }



   const updateState = (state = {}) => {
      setState(state);

   };

   const _renderItem = useCallback(({ item, index }) => {
      const { identifier, is_view } = item

      return (
         <NotificationListCell item={item}
            onPress={() =>
               utility.isEqual(is_view, '1') ? _onOpenNotification(item) : _readNotification(item)
               // _onOpenNotification(item)
            }
            onPressParent={() =>
               utility.isEqual(is_view, '1') ? _onOpenNotification(item) : _readNotification(item)
               // _onOpenNotification(item)
            }
         />
      )
   }, []);

   function _readNotification(item) {
      const { unique_id } = item;
      getReadNotification(unique_id, cbReadSuccess, () => { });
   }
   function cbReadSuccess(response) {

      dispatch(
         defaultAction(NOTIFICATION.UPDATE, response)
      )
      setTimeout(() => {
         _onOpenNotification(response);
      }, 400);
   }


   function _getUser(actor_id) {
      getOtherUser()
   }

   function getTargetUser(actor_id, identifier, route) {
      getOtherUser(actor_id, (user) => {
         // navigate(route, { user });

         navigate('FollowersAndFollowing', { user: user })
      })

   }


   function _onOpenNotification(item) {
      const { identifier, reference_id, actor_id } = item;

      switch (identifier) {
         case "followers":
            getTargetUser(actor_id, identifier, 'Followers')
            break;
         case "following":
            // navigate('Following')
            getTargetUser(actor_id, identifier, 'Following')
            break;
         case 'post_like':
            navigate('PostDetailView', { _id: reference_id })
            break;
         case 'post_tag':
            navigate('PostDetailView', { _id: reference_id })
            break;
         case "post_dislike":
            navigate('PostDetailView', { _id: reference_id })
            break;
         case "post_comment":
            navigate('PostDetailView', { _id: reference_id })
            break;
         case "comment_like":
            navigate('PostDetailView', { _id: reference_id })
            break;
         case "comment_dislike":
            navigate('PostDetailView', { _id: reference_id })
            break;
         case "accepted_follow_request":
            // navigate('Following')
            getTargetUser(actor_id, identifier, 'Following')
            break

         default:
            break;
      }

   }


   const { data, meta, isFetching } = useSelector(state => state.notificationListReducer);




   return (
      <View style={styles.mainContainer}>

         {
            loggedInUser &&
            // loggedInUser && loggedInUser.user_type === "artist" &&
            <View>
               <ButtonView
                  onPress={() => navigate('FollowRequest')}
                  style={styles.subcontainerFR}>
                  {notificationCount?.request_count > 0 ?
                     <IconWithBadge
                        iconstyle={styles.avatarFR}
                        source={Images.icFollowRequest}
                        badgeCount={8}
                        type={'request_count'}
                     />
                     : <Image
                        style={styles.avatarFR}
                        resizeMode="contain"
                        source={Images.icFollowRequest}
                     />}
                  <View>
                     <Title color={Colors.white}>{'Follow Request'}</Title>
                     <Paragraph color={Colors.inactive}>
                        {'Approve or ignore requests'}
                     </Paragraph>
                  </View>
               </ButtonView>
               <Separator />
            </View>

         }

         <FlatListHandler
            data={data}
            renderItem={_renderItem}
            emptyListMessage={"No Notifications"}
            style={{ paddingTop: 15 }}
            fetchRequest={_getNotificationList}
            meta={meta}
            isFetching={isFetching}
         />
      </View>
   );
};

export default index;
