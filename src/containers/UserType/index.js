import React, { useEffect } from 'react'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { SET_USER_TYPE } from '../../actions/ActionTypes'
import { defaultAction } from '../../actions/ServiceAction'
import { loggedInUser } from '../../data'
import { navigate, pop } from '../../services/NavigationService'
import { Images } from '../../theme'
import { USER_TYPES } from '../../theme/String'
import styles from './styles'

const index = (props) => {

   const { } = props
   const dispatch = useDispatch()
   const value = props.route.params

   const onPress = (type) => {
      loggedInUser.userType = type
      dispatch(defaultAction(SET_USER_TYPE, type))
      if (value.value === true) {
         pop()
         value.cbOnselection(type)
      } else {
         navigate('Signup')
      }

   }

   return (

      <ImageBackground source={Images.usertype} style={styles.bgImage}>
         <TouchableOpacity
            style={{ flex: 1, opacity: 1 }}
            onPress={() => onPress(USER_TYPES.FAN)}
         />
         <TouchableOpacity
            style={{ flex: 1, opacity: 1 }}
            onPress={() => onPress(USER_TYPES.ARTIST)}
         />
      </ImageBackground>
   )
}

export default index
