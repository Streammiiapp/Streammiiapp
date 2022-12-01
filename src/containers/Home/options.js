import React, { useCallback, useRef } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { AppStyles, Colors, Fonts, Images } from '../../theme';
import { Text } from '../../reuseableComponents/Typography';

export const screenOptions = ({ route }) => ({
   // tabBarIcon: ({ focused, color, size }) => {
   //    const { name } = route;
   //    const _source = name == 'MyPosts' ? Images.icGrid : name == 'TaggedPosts' ? Images.icTagPerson : Images.icLiked

   //    return (<Image source={_source} style={{ tintColor: name == 'LikedPosts' ? Colors.like : color }} />)
   // }
})

export const tabBarOptions = {
   labelStyle: {
      textTransform: 'none',
      ...Fonts.font(
         Fonts.FontFamily.default,
         Fonts.Type.Regular,
         14,
      ),
   },
   showIcon: false,
   showLabel: true,
   inactiveTintColor: Colors.inactive,
   activeTintColor: Colors.white,
   // indicatorStyle: { backgroundColor: Colors.white },
   // style: { borderBottomWidth: 2, borderBottomColor: Colors.shark }
}

const styles = StyleSheet.create({
   title: {
      ...Fonts.SemiBold(12),
      ...AppStyles.leftMargin10
   }
})
