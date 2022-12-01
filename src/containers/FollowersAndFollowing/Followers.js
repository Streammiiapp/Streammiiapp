import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { getFollowersFollowing } from '../../CommonApis'
import { UserList } from '../../components'
import { AppStyles } from '../../theme'
import { USER_LIST_TYPES } from '../../theme/String'
import utility from '../../utility'

const Followers = (props) => {

   const { route } = props;
   const loggedInUser = useSelector(({ user }) => user.data);


   const getFollowers = (isConcat, params, cbOnSuccess, cbOnFailure) => {

      let _params = {
         list_type: 'followers',
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
            fetchRequest={getFollowers}
            listType={USER_LIST_TYPES.FOLLOWERS}
            hideSearch={true}
            OtherId={route.params.user.id}
         />
      </View>
   )
}

export default Followers
