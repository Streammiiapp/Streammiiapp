import React, { useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native'
import { PostList } from '../../components'
import { pauseVideo, publishBusEvent, subscribeBusEvent } from '../../reuseableFunctions'
import { AppStyles, Colors, Metrics } from '../../theme'
import { BUS_EVENTS } from '../../theme/String'
import _ from 'lodash'
import { getPosts } from '../../CommonApis'
import { FlatListHandler } from '../../reuseableComponents'
import { useSelector } from 'react-redux'
import { useRef } from 'react'

const name = "searchGenre"

const data = [

   {
      id: 1,
      name: "hello"
   },
   {
      id: 2,
      name: "world"
   }

]

const Genre = (props) => {

   const [selectedItem, setSelectedItem] = useState([])
   const [value, setValue] = useState(null)

   const { musicTypes } = useSelector((state) => state)
   const { navigation, route: { params } } = props;

   const selectedIds = useRef([])

   useEffect(() => {

      const unsubBlur = navigation.addListener('blur', () => {
         pauseVideo(name)
      });

      return unsubBlur

   }, [])

   const getVideos = (isConcat, params, cbOnSuccess, cbOnFailure) => {


      const _payload = {
         ...params,
         check_post_type: 'genre',
         ...selectedIds.current
      }

      getPosts(
         isConcat,
         _payload,
         cbOnSuccess,
         cbOnFailure,
      )
   }

   function getSelectedState(id) {
      return selectedItem.find(e => e.id === id);
   }

   function _renderItem({ item, index }) {
      return (
         <TouchableOpacity
            style={[
               getSelectedState(item.id)
                  ? styles.itemContainerActive
                  : styles.itemContainerDefault,

            ]}
            onPress={() => ItemSelect(item)}>
            <Text style={{ color: 'white' }} numberOfLines={1} size={12}>
               {item.title}
            </Text>
         </TouchableOpacity>
      );
   }



   function ItemSelect(item) {
      let temp_arr = _.cloneDeep(selectedItem);

      if (temp_arr.find(e => e.id === item.id)) {
         let index = temp_arr.findIndex(it => it.id === item.id);
         temp_arr.splice(index, 1);
      } else {
         temp_arr = _.concat(...temp_arr, item);
      }
      setSelectedItem(temp_arr);
      // setTimeout(() => {
      //    getVideos()
      // }, 1000)
      let local = {}
      temp_arr.forEach((val, index) => {
         local[`music_genres_id[${index}]`] = val.id;
      })
      selectedIds.current = local;

      // SEARCH_TEXT_CHANGE is actually for searching from searchbar but because i could not
      // find any other easy way for doing search on category selection that is why improvising
      // with the same event
      publishBusEvent(BUS_EVENTS.SEARCH_TEXT_CHANGE, { isAddingCategoriesToSearch: true })
   }

   return (
      <>
         <View style={{ height: Platform.OS === "ios" ? Metrics.heightRatio(50) : Metrics.heightRatio(90), }}>
            <FlatListHandler
               data={musicTypes.data}
               bounces={false}
               renderItem={_renderItem}
               horizontal={true}
               style={{ marginHorizontal: Metrics.smallMargin, marginTop: Metrics.smallMargin }}
               contentContainerStyle={{ alignItems: 'center', }}
            />
         </View>
         <View style={AppStyles.flex}>
            <PostList
               fetchRequest={getVideos}
               name={name}
               emptyListMessage={"No Results Found"}
               searching={true}
               tabName='genre'
            />
         </View>
      </>
   )
}

export default Genre

const styles = StyleSheet.create({
   itemContainerActive: {
      height: 30,
      paddingHorizontal: Metrics.baseMargin,
      margin: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.white,
      backgroundColor: Colors.theme,
      justifyContent: 'center',
   },
   itemContainerDefault: {
      height: 30,
      paddingHorizontal: Metrics.baseMargin,
      margin: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.white,
      justifyContent: 'center',
      backgroundColor: Colors.grey,
   }
})
