import React, { useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { getUsers } from '../../CommonApis'
import { UserList } from '../../components'
import { users } from '../../data'
import { navigate } from '../../services/NavigationService'
import { AppStyles } from '../../theme'
import { USER_LIST_TYPES } from '../../theme/String'

const index = (props) => {

   const { route } = props

   const onSelect = (ids, users) => {
      navigate('ChatRoom', { otherUser: users[0] })
   }

   const getArtists = (isConcat, params, cbOnSuccess, cbOnFailure) => {
      getUsers(
         isConcat,
         params,
         cbOnSuccess,
         cbOnFailure
      )
   }

   return (
      <View style={[AppStyles.flex, AppStyles.hBasePadding]}>
         <UserList
            users={users}
            fetchRequest={getArtists}
            listType={USER_LIST_TYPES.DEFAULT}
            disabled={false}
            onSelectionChange={onSelect}
            routeName={route}
         />
      </View>
   )
}

export default index
