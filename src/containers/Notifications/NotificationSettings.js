import React, { useMemo, useCallback, useEffect } from 'react'
import { FlatList, SafeAreaView, Switch, View } from 'react-native'
import { useMergeState } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { AppButton, Separator } from '../../reuseableComponents'
import { Paragraph } from '../../reuseableComponents/Typography'
import { getLoggedInUser, isFan } from '../../reuseableFunctions'
import { pop } from '../../services/NavigationService'
import { Colors, Metrics } from '../../theme'
import { artistOptions, fanOptions } from './options'
import styles from './styles'
import { request } from '../../actions/ServiceAction'
import constant from '../../constants'
import { USER } from '../../actions/ActionTypes';
import { updateUser } from '../../CommonApis'

const index = (props) => {

   const { } = props
   // const loggedInUser = getLoggedInUser()
   const dispatch = useDispatch()
   const loggedInUser = useSelector(({ user }) => user.data);

   const loggedInUserNoti = loggedInUser.user_notification_setting;

   const [state, setState] = useMergeState({
      data: loggedInUserNoti,
   })

   // const form = useMemo(() => {
   //    if (isFan()) {
   //       return fanOptions
   //    }
   //    return artistOptions
   // }, [loggedInUser.user_type])

   const onSubmit = () => {
      let payload = {};
      state.data.forEach((val, index) => {
         payload[`notification_setting[${val.meta_key}]`] = val.meta_value;
      })
      dispatch(
         request(
            constant.notificationSetting,
            constant.serviceTypes.POST,
            payload,
            USER,
            true,
            false,
            cbOnSuccess
         )
      )
   };

   const cbOnSuccess = (res, meta, message) => {
      // showAlert({
      //   title: 'Success',
      //   message: 'Your password changed successfully',
      //   canChoose: false,
      //   onRightPress: () => pop()
      // })
      pop()
   }

   const setPrivateValue = useCallback((singleVal) => ev => {
      const newArr = state.data.map(p =>
         p.meta_key === singleVal.meta_key
            ? { ...p, meta_value: singleVal.meta_value == 1 ? 0 : 1 }
            : p
      );
      setState({
         data: newArr
      })
   }, [state])

   const _renderItem = ({ item, index }) => {
      return (
         <>
            <View
               style={styles.switchCellMainView}>
               <View style={styles.switchCellSubView}>
                  <Paragraph size={14} color={Colors.white}>
                     {item.meta_key.replace("_", " ")}
                  </Paragraph>
               </View>
               <Switch
                  trackColor={{
                     true: Colors.theme,
                     false: Colors.inactive,
                  }}
                  thumbColor={Colors.white}
                  onValueChange={setPrivateValue(item)}
                  value={!!item.meta_value}
               />
            </View>
            <Separator />
         </>
      )
   }

   return (
      <SafeAreaView style={styles.mainContainer}>
         <FlatList
            data={state.data}
            renderItem={_renderItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => index + ''}
            ListFooterComponent={() => <AppButton title="Save" onPress={onSubmit} />}
            ListFooterComponentStyle={{ marginTop: Metrics.xDoubleBaseMargin }}
         />

      </SafeAreaView>
   )
}

export default index
