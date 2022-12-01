import React, { useCallback, useEffect, useRef } from 'react'
import { View, Text, Platform } from 'react-native'
import { ImageButton } from '../../reuseableComponents'
import { AppStyles, Images, Metrics } from '../../theme'
import {
   GoogleSignin,
} from '@react-native-google-signin/google-signin';
import utility from '../../utility'
import { deviceId } from '../../reuseableFunctions';
import { navigate } from '../../services/NavigationService';


let androidGoogleKey =
   '176759553575-dcmb12dha4jpf215hnpjbsqs8l42lqog.apps.googleusercontent.com';
let iosGoogleKey =
   '176759553575-dcmb12dha4jpf215hnpjbsqs8l42lqog.apps.googleusercontent.com';

GoogleSignin.configure({
   webClientId: Platform.OS === 'ios' ? iosGoogleKey : androidGoogleKey,
   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});
const GoogleSignIn = (props) => {

   const { onSignin } = props



   const googleSignIn = async (userType) => {
      try {
         await GoogleSignin.hasPlayServices();
         const { user } = await GoogleSignin.signIn();
         const payload = {
            name: user.givenName + ' ' + user.familyName,
            email: user.email,
            platform_id: user.id,
            'platform_type': 'google',
            device_type: Platform.OS,
            device_token: utility.oneSignalPlayerId,
            image_url: user.photo ?? null
         }
         onSignin(payload, userType)
      } catch (error) {
         global.log({ error });
      }
   }

   const cbOnselection = (userType) => {
      global.log("userType extract::", userType.id);
      googleSignIn(userType)
   }

   const checkType = () => {
      navigate('UserType', { cbOnselection, value: true })
   }

   return (
      <ImageButton
         round
         source={Images.icGoogle}
         style={{ marginLeft: Metrics.smallMargin }}
         onPress={checkType}
      />
   )
}

export default GoogleSignIn
