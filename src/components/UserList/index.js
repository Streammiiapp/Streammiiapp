import React, {
   useCallback, useEffect, useRef
} from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { acceptFollowRequest, deleteFollowRequest, followUser, removerFollowerUser, unblockUser } from '../../CommonApis'
import { useMergeState } from '../../hooks'
import { FlatListHandler, SearchBar } from '../../reuseableComponents'
import { closeAlert, getLoggedInUser, setNotificatonCount, showAlert, subscribeBusEvent, updateByIndex, updateMultiSelect } from '../../reuseableFunctions'
import { navigate, pop, push } from '../../services/NavigationService'
import { AppStyles } from '../../theme'
import { BUS_EVENTS, USER_LIST_TYPES } from '../../theme/String'
import utility from '../../utility'
import UserListCell from '../UserListCell'
import { useState } from 'react';
import { defaultAction } from '../../actions/ServiceAction'
import { REMOVE_FOLLOWER, USER } from '../../actions/ActionTypes'
import _ from 'lodash'

const {
   DEFAULT,
   SELECTION
} = USER_LIST_TYPES

export const callDispatch = (request) => {
   const dispatch = singleton.storeRef.dispatch
   dispatch(request)
}

const index = (props) => {

   const {
      listType, fetchRequest,
      selectedIds, selectedUsers,
      disabled, onSelectionChange,
      hideSearch, searching, tabName, routeName, OtherId
   } = props

   const dispatch = useDispatch();

   const mountRef = useRef(false)
   const stateRef = useRef(false)
   const user = useSelector(({ user }) => user.data)
   const searchText = useRef('');
   const loggedInUser = getLoggedInUser()

   const [state, setState] = useMergeState({
      users: [],
      meta: null,
      isFetching: false,
      selectedIds: selectedIds,
      selectedUsers: selectedUsers
   })

   // const [users, setusers] = useState([])

   useEffect(() => {

      if (searching) {
         subscribeBusEvent(BUS_EVENTS.SEARCH_TEXT_CHANGE, cbOnSearch)
      } else {
         fetchUsers()
      }

      return () => {
         mountRef.current = false
      }
   }, [])

   useEffect(() => {
      if (!mountRef.current) {
         mountRef.current = true
      } else {
         onSelectionChange?.(state.selectedIds, state.selectedUsers)
      }
   }, [state.selectedIds])

   useEffect(() => {
      stateRef.current = state
   }, [state])

   const updateState = (state = {}) => {
      if (mountRef.current) {
         setState(state)
      }
   }

   const fetchUsers = (isConcat, params) => {

      let _params = { ...params, screen_name: 'default', user_type: 'artist' }

      if (searching) {
         _params = { ...params, screen_name: 'search', keyword: searchText.current, }
      }

      if (fetchRequest) {
         setState({ isFetching: true })
         fetchRequest(
            isConcat,
            _params,
            (users, message, meta) => {
               updateState({ meta, isFetching: false })
               // setusers(users)
               setState({ users: isConcat ? [...state.users, ...users] : [...users] })
            },
            cbOnFailure
         )
      }
   }


   const cbOnFailure = () => { updateState({ isFetching: false }) }

   const cbOnSearch = ({ text, activeTab }) => {
      if (activeTab == tabName && searchText.current != text) {
         searchText.current = text
         fetchUsers()
      }
   }

   // const follow = (item, index) => () => {
   const follow = (item, index) => () => {
      if (utility.isEqual(item.following, '1')) {
         //unfollow
         deleteFollowRequest(item.id)
      } else {
         //follow
         followUser({
            actor_id: user.id,
            target_id: item.id,
            status: 1
         })
      }

      const users = updateByIndex(
         stateRef.current.users,
         index,
         { following: !utility.isEqual(item.following, '1') ? '1' : '0' }
      )

      setState({ users })
      // setusers({ users })
   }

   const removeFollowerConfirmation = (item, index) => () => {
      showAlert({
         message: `Are you sure you want to remove “${item.name}”?`,
         canChoose: true,
         onRightPress: () => removeFollower(item, index),
         isRightNegative: true
      })
   }

   const cancelFollowerConfirmation = (item, index) => () => {
      showAlert({
         message: `Are you sure you want to cancel “${item.name}”?`,
         canChoose: true,
         onRightPress: () => cancelFollowReq(item, index),
         isRightNegative: true
      })
   }

   const removeFollower = (item, index) => {
      closeAlert()
      // const updatedUsers = [...state.users].splice(index, 1);
      // updateState({ users: updatedUsers })
      // setusers(usrs => {
      //    const updatedUsers = [...usrs]
      //    updatedUsers.splice(index, 1);
      //    return updatedUsers
      // })
      removerFollowerUser(item.id, cbOnSuccessRemove);
      fetchUsers()
   }

   cbOnSuccessRemove = (response) => {
      //do work here
      if (+user.no_of_followers > 0) {
         const tempUser = _.cloneDeep(user);
         tempUser.no_of_followers = user.no_of_followers - 1
         dispatch(
            defaultAction(USER.SUCCESS, tempUser)
         )
      }
   }

   const cancelFollowReq = (item, index) => {
      closeAlert()
      const updatedUsers = [...state.users].splice(index, 1);
      updateState({ users: updatedUsers })
      // setusers(usrs => {
      //    const updatedUsers = [...usrs]
      //    updatedUsers.splice(index, 1);
      //    return updatedUsers
      // })
      removerFollowerUser(item.id);
   }

   const removeFollowing = () => () => { }


   const confirmFollowReq = (item, index) => () => {

      const updatedUsers = [...state.users].splice(index, 1);
      updateState({ users: updatedUsers })
      // setusers(usrs => {
      //    const updatedUsers = [...usrs]
      //    updatedUsers.splice(index, 1);
      //    return updatedUsers
      // })
      acceptFollowRequest(item.id, cbOnSuccessAccept)
   }

   const cbOnSuccessAccept = () => {
      setNotificatonCount(0, 0, notificationCount.message_counter);
   }

   const confirmUnblock = (item, index) => () => {
      showAlert({
         message: `Are you sure you want to unblock “${item.name}”?`,
         canChoose: true,
         onRightPress: () => unblock(item, index),
         isRightNegative: true
      })
   }

   const unblock = (item, index) => {
      closeAlert()
      // const updatedUsers = [...state.users].splice(index, 1);
      // updateState({ users: updatedUsers })

      // setusers(usrs => {
      //    const updatedUsers = [...usrs]
      //    updatedUsers.splice(index, 1);
      //    return updatedUsers
      // })
      unblockUser(item.id)
      fetchUsers()
   }

   const onPress = useCallback((user) => () => {
      if (listType == SELECTION) {
         const { selectedIds, selectedUsers } = stateRef.current
         const { updatedIds, updatedData } = updateMultiSelect(selectedUsers, selectedIds, user)

         updateState({
            selectedIds: updatedIds,
            selectedUsers: updatedData,
         })
      } else if (listType == DEFAULT) {
         updateState({
            selectedIds: [user.id],
            selectedUsers: [user],
         })
      }
      if (user.id == loggedInUser.id) {
         navigate('Profile')
      } else if (routeName?.name != 'TagPeople' && routeName?.name != 'NewMessage') {
         push('OtherProfile', { userSlug: user.slug })
      }
   }, [])

   const _isSelected = (user) => {
      if (listType == SELECTION && state.selectedIds.includes(user.id)) {
         return true
      }
      return false
   }

   const setSearchText = (text) => {
      searchText.current = text
      fetchUsers(false, { page: 1, keyword: text, user_type: 'artist' })
   }

   const _renderItem = useCallback(({ item, index }) => {
      return (
         <UserListCell
            user={item}
            listType={listType}
            disabled={props.disabled ? props.disabled : false}
            isSelected={_isSelected(item)}
            onPress={onPress(item)}
            onFollow={follow(item, index)}
            onUnblock={confirmUnblock(item, index)}
            onRemoveFollower={removeFollowerConfirmation(item, index)}
            onRemoveFollowing={removeFollowing}
            onConfirmFollowReq={confirmFollowReq(item, index)}
            onCancelFollowReq={cancelFollowerConfirmation(item, index)}
            OtherId={OtherId}
         />
      )
   }, [state.selectedIds])

   return (
      <View style={AppStyles.flex}>
         {!hideSearch &&
            <SearchBar
               onChangeText={setSearchText}
            />
         }
         <FlatListHandler
            data={state.users}
            renderItem={_renderItem}
            fetchRequest={fetchUsers}
            emptyListMessage={props.emptyListMessage}
            meta={state.meta}
            isFetching={state.isFetching}
         />
      </View>
   )
}

index.defaultProps = {
   listType: USER_LIST_TYPES.DEFAULT,
   selectedIds: [],
   selectedUsers: [],
   hideSearch: false,
   routeName: {}
}
export default index
