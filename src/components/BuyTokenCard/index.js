import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Images, Colors, Metrics } from '../../theme';
import { Paragraph, Title } from '../../reuseableComponents/Typography';
import { ButtonView } from '../../reuseableComponents';

const Index = props => {
   const { data, onPress, active } = props;
   return (
      <View style={styles.container}>
         <ButtonView
            onPress={() => onPress(data.productId)}
            style={[styles.btn, data.productId === active.productId ? styles.activeContainer : {}]}>
            <Image source={Images.buyToken} style={{ height: 100, width: 100 }} />
            <Title style={styles.text} size={22} color={Colors.white}>
               {`${data.description} \n ${data.localizedPrice}`}
            </Title>
            {/* <Paragraph size={18} color={Colors.white}></Paragraph> */}
         </ButtonView>
      </View>
   );
};

export default Index;

const styles = StyleSheet.create({
   container: {
      marginRight: 30,
      alignItems: 'center',
   },
   btn: {
      backgroundColor: Colors.darkGrey,
      height: 240,
      borderRadius: 40,
      width: 240,
      // width: '70%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingTop: 20,
   },
   activeContainer: {
      borderWidth: 1,
      borderColor: Colors.token,
   },
   text: {
      lineHeight: 25,
      textAlign: 'center',
   },
});
