import React, { useCallback, memo } from 'react'
import { View, Text } from 'react-native'
import { Avatar, ButtonView } from '../../reuseableComponents'
import { Paragraph, Title } from '../../reuseableComponents/Typography'
import { AppStyles, Colors, Metrics } from '../../theme'
import styles from './styles'
import moment from 'moment'
import utility from '../../utility'
import { push } from '../../services/NavigationService'

const index = (props) => {

   const { item, onPress } = props;

   return (
      <ButtonView onPress={onPress}>
         <View style={styles.notiCellMainview}>
            <View style={styles.notiCellSubview1}>
               <Avatar source={{ uri: item.actor_image_url }} size={40} />
               <Title style={[AppStyles.hBaseMargin]} onPress={props.onPressParent}>
                  <Title
                     onPress={() => push('OtherProfile', { userSlug: item.actor_slug })}
                     size={14}
                     color={Colors.white}
                     style={[AppStyles.hBaseMargin]}>
                     {item.actor_name + ' '}
                  </Title>
                  <Paragraph
                     size={14}
                     color={Colors.inactive}>
                     {item.description}
                  </Paragraph>
               </Title>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Paragraph size={14} color={Colors.inactive}>
                  {moment.utc(item.created_at).fromNow()}
               </Paragraph>
               {
                  utility.isEqual(item.is_view, '0') && <View style={{ backgroundColor: 'blue', marginLeft: 4, width: 4, height: 4 }} />
               }

            </View>
         </View>
      </ButtonView>
   )
}

export default memo(index)
