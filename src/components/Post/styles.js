import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts, AppStyles } from '../../theme';

export default StyleSheet.create({
   headerContainer: {
      flex: 1,
      paddingLeft: Metrics.baseMargin,
      paddingRight: Metrics.smallMargin,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Metrics.baseMargin,
      // position: 'absolute',
      // top: 0,
      // zIndex: 999,
   },
   contentContainer: {
      backgroundColor: Colors.greenishBlack,
      justifyContent: 'center',
      marginTop: Metrics.baseMargin,

   },
   contentWrapper: {
      paddingBottom: Metrics.baseMargin,
   },
   actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: Metrics.smallMargin,
      paddingHorizontal: Metrics.baseMargin,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.inactive,
      borderBottomWidth: 0.8,
      borderBottomColor: Colors.inactive,
   },
   tikTokActionsContainer: {
      // flexDirection: 'row',
      // justifyContent: 'center',
      // backgroundColor: 'pink',
      alignItems: 'flex-end',
      paddingVertical: Metrics.heightRatio(50),
      paddingHorizontal: Metrics.baseMargin,
      // backgroundColor: 'red'
      // borderTopWidth: StyleSheet.hairlineWidth,
      // borderTopColor: Colors.inactive,
      // borderBottomWidth: 0.8,
      // borderBottomColor: Colors.inactive,
      // position: 'absolute',
      // bottom: 0,
      // zIndex: 999
   },
   detailsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: Metrics.smallMargin,
      paddingHorizontal: Metrics.smallMargin,
   },
   bgFade: {
      position: 'absolute',
      bottom: 0,
      height: Metrics.heightRatio(46),
      width: '100%',
   },
   actionButton: {
      flexDirection: 'row',
      padding: Metrics.heightRatio(4),
      alignItems: 'center',
   },
   actionTitle: {
      marginLeft: Metrics.heightRatio(4),
      ...Fonts.SemiBold(12),
   },
   contentMargin: {
      marginBottom: Metrics.heightRatio(46),
      marginHorizontal: Metrics.baseMargin,
   },
   supportContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   supportText: {
      marginHorizontal: Metrics.baseMargin,
      marginBottom: Metrics.smallMargin,
      lineHeight: 25,
      flex: 1
   },
   message: {
      marginHorizontal: Metrics.baseMargin,
      marginBottom: Metrics.smallMargin
   },
   tikTokMessage: {
      marginLeft: Metrics.baseMargin,
      marginBottom: Metrics.smallMargin,
      marginRight: Metrics.widthRatio(50)

   },
   txtTags: {
      marginHorizontal: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin
   },
   tikToktxtTags: {
      marginHorizontal: Metrics.baseMargin,
      marginBottom: Metrics.baseMargin,

   },
   btnSupport: {
      marginLeft: Metrics.baseMargin,
      marginTop: Metrics.heightRatio(30)
   },
   growOne: {
      flexGrow: 1,
   },

});
