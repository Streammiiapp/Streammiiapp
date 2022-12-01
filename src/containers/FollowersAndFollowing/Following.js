import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { getFollowersFollowing } from '../../CommonApis'
import { UserList } from '../../components'
import { users } from '../../data'
import { useMergeState } from '../../hooks'
import { AppStyles } from '../../theme'
import { USER_LIST_TYPES } from '../../theme/String'
import utility from '../../utility'

const Following = (props) => {

   const { route } = props;
   const [state, setState] = useMergeState({
      following: users
   });

   const loggedInUser = useSelector(({ user }) => user.data);


   const getFollowing = (isConcat, params, cbOnSuccess, cbOnFailure) => {
      let _params = {
         list_type: 'following',
         user_id: utility.isEqual(route.params.user.id, loggedInUser.id) ? '' : route.params.user.id,
         ...params
      }
      getFollowersFollowing(
         isConcat,
         _params,
         cbOnSuccess,
         cbOnFailure
      )
   }

   return (
      <View style={[AppStyles.flex, AppStyles.hBasePadding]}>
         <UserList
            fetchRequest={getFollowing}
            listType={USER_LIST_TYPES.FOLLOWING}
            hideSearch={true}
         />
      </View>
   )
}

export default Following
