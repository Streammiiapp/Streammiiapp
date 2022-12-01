import React from 'react';
import { View } from 'react-native';
import { Avatar, Separator, ButtonView } from '../../reuseableComponents';
import { Paragraph, Headline } from '../../reuseableComponents/Typography';
import { AppStyles, Colors } from '../../theme';
import styles from './styles';
import moment from 'moment';
import utility from '../../utility';
import { navigate } from '../../services/NavigationService';

const index = props => {
   const {
      item: { createdAt, image, lastMsg, isUnread, name },
   } = props;
   return (
      <>
         <ButtonView
            onPress={props.onPress}
            style={styles.container}>
            <Avatar style={styles.avatar} size={46} source={{ uri: image }} />
            <View style={styles.wrapper}>
               <View style={[AppStyles.flexRow]}>
                  <Headline numberOfLines={1} size={16} style={AppStyles.flex}>
                     {name}
                  </Headline>
                  <Paragraph style={styles.date} size={13} color={Colors.inactive}>
                     {utility.timeFromNow(createdAt)}
                  </Paragraph>
               </View>
               <View style={[AppStyles.flexRow]}>
                  <Paragraph numberOfLines={1} size={13} color={Colors.inactive} style={AppStyles.flex}>
                     {lastMsg}
                  </Paragraph>
                  {isUnread && <View style={styles.unread} />}
               </View>
            </View>
         </ButtonView>
         <Separator />
      </>
   );
};

export default index;
