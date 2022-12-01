//
//  index.js:
//  BoilerPlate
//
//  Created by Retrocube on 10/4/2019, 9:49:50 AM.
//  Copyright © 2019 Retrocube. All rights reserved.
//
import { Alert, Linking } from 'react-native';
import Color from 'color';
import moment from 'moment';
import _ from 'lodash'

class utility {
   EdgePadding = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
   };

   onChangeTxtSearch = (txt) => {  //1
      this.onChangeTxtSearchTab?.(txt);
   }
   // getOnChangeTxtSearch = () => this.onChangeTxtSearch
   onChangeTxtSearchTab; //2
   setOnChangeTxtSearchTab = (callback) => this.onChangeTxtSearchTab = callback;


   isPlatformAndroid = () => Platform.OS === 'android';
   isPlatformIOS = () => Platform.OS === 'ios';
   oneSignalPlayerId;

   setOneSignalPlayerId = (id) => (this.oneSignalPlayerId = id);

   validateEmail = text => {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
         return false;
      }
      return true;
   };

   alerts = (title, description, onPress) => {
      Alert.alert(
         title,
         description,
         [
            { text: 'OK', onPress: onPress },
            { text: 'Cancel', onPress: () => { } },
         ],
         {
            cancelable: false,
         },
      );
   };

   alphaColor = (color, alpha) => {
      return Color(color).alpha(alpha).rgb().string();
   };

   imageViewerRef = null;
   setImageViewerRef = ref => (this.imageViewerRef = ref);
   getImageViewerRef = () => this.imageViewerRef;

   dateFormat = (date, format) => moment(date).format(format);
   timeFromNow = givenDate => moment(givenDate).fromNow();
   isEmpty = (value) => _.isEmpty(value)
   isEqual = (value1, value2) => _.isEqual(value1, value2)
}

export default new utility();
