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
                  uri: 'https://www.streammii.com/app-faq',
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











// import React, { useState, useEffect } from 'react';
// import { Text, View, Image, ImageBackground, StatusBar, SafeAreaView } from 'react-native';
// import styles from './styles';
// import { FlatListHandler, ButtonView, ImageButton, Separator } from '../../reuseableComponents';
// import { Images, Colors, Metrics } from '../../theme';
// import { NavBackButton } from '../../components';
// import utility from '../../utility';
// import { faqs } from '../../data';

// const index = (props) => {

//   const { navigation } = props
//   const [activeId, setActiveId] = useState(-1)

//   const _onCellPress = (index) => {
//     index == activeId ? setActiveId(-1) : setActiveId(index)
//   }

//   const _renderItem = ({ item, index }) => {
//     return (
//       <View style={styles.cellWrapper}>
//         <ButtonView
//           onPress={() => _onCellPress(index)}
//           style={styles.btnQuestion}>

//           <Text style={styles.question}>{item.question}</Text>
//           <Image
//             source={index == activeId ? Images.icDown : Images.icForward}
//             style={styles.icon}
//           />

//         </ButtonView>
//         {index == activeId &&
//           <View style={styles.answerContainer}>
//             <Text style={styles.answer}>{item.answer}</Text>
//           </View>
//         }
//         <Separator style={{ marginTop: Metrics.doubleBaseMargin }} />
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>

//       <ImageBackground
//         style={styles.bg}
//         source={Images.bgFaq}>
//         <Text style={styles.txtBg}>How can we help you?</Text>
//       </ImageBackground>
//       <FlatListHandler
//         data={faqs}
//         renderItem={_renderItem}
//       />
//     </SafeAreaView>
//   )
// }

// export default index
