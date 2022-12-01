import React, { useCallback, useRef } from 'react'
import { View, Text, Platform } from 'react-native'
import {
   LoginManager,
   AccessToken,
   GraphRequest,
   GraphRequestManager,
} from 'react-native-fbsdk-next';
import { ImageButton } from '../../reuseableComponents';
import { deviceId } from '../../reuseableFunctions';
import { navigate } from '../../services/NavigationService';
import { Images, Metrics } from '../../theme';
import utility from '../../utility';

const FacebookSignIn = (props) => {

   const { onSignin } = props

   fbSignIn = (userType) => {
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
         function (result) {
            if (result.isCancelled) {
            } else {

               AccessToken.getCurrentAccessToken().then((data) => {
                  let accessToken = data.accessToken;
                  const responseInfoCallback = (error, result) => {
                     if (error) {
                     } else {
                        const payload = {
                           name: result.first_name + ' ' + result.last_name,
                           email: result.email,
                           platform_id: result.id,
                           'platform_type': 'facebook',
                           device_type: Platform.OS,
                           device_token: utility.oneSignalPlayerId,
                           image_url: result.picture?.data?.url ?? null
                        }
                        onSignin(payload, userType)
                        LoginManager.logOut(); //logout fb
                     }
                  };
                  const infoRequest = new GraphRequest(
                     '/me',
                     {
                        accessToken: accessToken,
                        parameters: {
                           fields: {
                              string:
                                 'email,name,first_name,middle_name,last_name,picture.type(large)',
                           },
                        },
                     },
                     responseInfoCallback,
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(infoRequest).start();
               });
            }
         },
         function (error) {
            global.log('Login failed with error: ' + error);
         },
      );
   };

   const cbOnselection = (userType) => {
      global.log("userType extract::", userType.id);
      fbSignIn(userType)
   }

   const checkType = () => {
      navigate('UserType', { cbOnselection, value: true })
      // fbSignIn()
   }

   return (
      <ImageButton
         round
         source={Images.icFb}
         style={{ marginRight: Metrics.smallMargin }}
         onPress={checkType}
      />
   )
}

export default FacebookSignIn
