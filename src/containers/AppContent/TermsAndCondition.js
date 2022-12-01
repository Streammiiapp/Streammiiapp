import React, { useRef, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Metrics, Fonts, Colors } from '../../theme';
import { WebView } from 'react-native-webview';

const index = (props) => {

   const { } = props
   const [isError, setIsError] = useState(false);

   return (
      <View style={{ flex: 1, backgroundColor: Colors.greenishBlack }}>
         {isError === false ? (
            <WebView
               source={{
                  uri: 'https://www.streammii.com/content/terms-condition',
               }}
               // renderLoading={() => showSpinner()}
               startInLoadingState={true}
               style={{}}
               javaScriptEnabled={true}
               onError={() => setIsError(true)}
            // renderLoading={() => showSpinner()}
            />
         ) : (
            <View style={styles.subContainer}>
               <Text style={styles.errorText}>{'Some Error Occured'}</Text>
               <TouchableOpacity
                  style={styles.reload}
                  onPress={() => setIsError(false)}>
                  <Text style={styles.reloadText}>{'Reload'}</Text>
               </TouchableOpacity>
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   iconHome: {
      marginHorizontal: 15,
      width: 26,
      height: 26,
   },
   subContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   errorText: {
      fontSize: 20,
      color: Colors.white,
      marginBottom: 25,
   },
   reload: {
      backgroundColor: Colors.link,
      height: 40,
      width: '60%',
      alignItems: 'center',
      justifyContent: 'center',
   },
   reloadText: {
      fontSize: 20,
      color: 'white',
   },
});

export default index
