//
//  index.js:
//  BoilerPlate
//
//  Created by Retrocube on 06/11/2020, 9:27:23 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Metrics } from '../../theme';
import utility from '../../utility';
import { useEffect } from 'react';
import { setNotificatonCount } from '../../reuseableFunctions';
import { request } from '../../actions/UserLocation';

const icon = require('./img/icNotifications.png');
const IconWithBadge = ({
   source = icon,
   badgeCount = 0,
   style = {},
   iconstyle = {},
   type
}) => {
   const { data, } = useSelector((state) => state.notificationCount);

   // useEffect(() => {
   //    setNotificatonCount(0);
   // })
   return (
      <View style={iconstyle}>
         <Image source={source} resizeMode="contain" style={styles.icon} />
         {!utility.isEmpty(data) && (
            <View
               style={{
                  // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                  position: 'absolute',
                  right: -2,
                  top: -4,
                  backgroundColor: '#E22620',
                  borderRadius: utility.isEqual(type, 'request_count') ? Metrics.widthRatio(18 / 2) : Metrics.widthRatio(12 / 2),
                  width: utility.isEqual(type, 'request_count') ? Metrics.widthRatio(18) : Metrics.widthRatio(12),
                  height: utility.isEqual(type, 'request_count') ? Metrics.widthRatio(18) : Metrics.widthRatio(12),
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 10,
                  ...style,
               }}>
               {
                  utility.isEqual(type, 'request_count') ?
                     <Text style={styles.count}>{data.request_count}</Text> :
                     utility.isEqual(type, 'message_counter') ?
                        <Text style={styles.tabCount}>{data.message_counter}</Text> :
                        <Text style={styles.tabCount}>{data.badge_count}</Text>

               }

            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   icon: {
      //   height: Metrics.widthRatio(20),
      //   width: Metrics.widthRatio(20)
   },
   count: {
      fontSize: 12,
      color: '#fff',
      fontWeight: '700',
      textAlign: 'center'
   },
   tabCount: {
      fontSize: 10,
      color: '#fff',
      fontWeight: '500',
      lineHeight: 11,
   },
});

export default IconWithBadge;
