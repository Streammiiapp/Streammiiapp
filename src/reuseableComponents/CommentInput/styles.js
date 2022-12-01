import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts, AppStyles } from "../../theme";

export default StyleSheet.create({
   container: {
      paddingHorizontal: Metrics.smallMargin,
      backgroundColor: Colors.greenishBlack,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   input: {
      flex: 1,
      minHeight: 44,
      borderRadius: 22,
      backgroundColor: Colors.darkGrey,
      paddingHorizontal: 15,
      marginVertical: 5,
      marginRight: 5,
      ...Fonts.Regular(12),
      paddingTop: 15,
      paddingBottom: 15,
   },
   btnSend: {
      height: 42,
      width: 42,
      backgroundColor: Colors.darkGrey,
   }
})