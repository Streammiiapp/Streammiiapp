import React, {
   useCallback, useEffect, useRef
} from 'react'
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { request } from '../../actions/ServiceAction';
import { UserList } from '../../components';
import constant from '../../constants';
import { users } from '../../data';
import { useMergeState } from '../../hooks';
import { setNotificatonCount, showAlert } from '../../reuseableFunctions';
import { AppStyles } from '../../theme';
import { USER_LIST_TYPES } from '../../theme/String';
import { useSelector } from 'react-redux';

const index = props => {
   const { } = props;

   const { } = props
   const dispatch = useDispatch()
   const notificationCount = useSelector((state) => state.notificationCount.data);

   useEffect(() => {
      setNotificatonCount(0, 0, notificationCount.message_counter);
   }, []);

   const getFollowRequest = (isConcat, params, cbOnSuccess, cbOnFailure) => {
      dispatch(
         request(
            constant.userFollowRequest,
            constant.serviceTypes.GET,
            params,
            null,
            false,
            isConcat,
            cbOnSuccess,
            cbOnFailure
         )
      )
   }

   const removeFollowerConfirmation = (item, index) => () => {
      showAlert({
         message: `Are you sure you want to remove “${item.name}”?`,
         canChoose: true,
         onRightPress: () => removeFollower(item, index),
         isRightNegative: true
      })
   }
   return (
      <View style={[AppStyles.flex, AppStyles.hBasePadding]}>
         <UserList
            fetchRequest={getFollowRequest}
            emptyListMessage={"When people ask to follow, you'll see their request here"}
            // users={state.requests}
            listType={USER_LIST_TYPES.FOLLOW_REQUEST}
            hideSearch={true}
         />
      </View>
   );
};

export default index;
