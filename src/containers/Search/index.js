import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SearchBar } from '../../reuseableComponents';
import { publishBusEvent } from '../../reuseableFunctions';
import { navigate } from '../../services/NavigationService';
import { AppStyles } from '../../theme';
import { BUS_EVENTS } from '../../theme/String';
import utility from '../../utility';
import Artist from './artist';
import Audio from './audio';
import Genre from './genre';
import { tabBarOptions } from './options';
import Video from './video';

const Tab = createMaterialTopTabNavigator();

const SearchTabs = (props) => {

   const { navigation } = props
   let activeTab = useRef('audio');
   const searchText = useRef('');

   useEffect(() => {
      utility.setOnChangeTxtSearchTab(onSearchTextChange)
   }, [])

   const onTabChange = ({ route }) => ({
      tabPress: e => {
         activeTab.current = route.name.toLowerCase()
         publishSearchEvent()
         // e.preventDefault();
         // navigate(route.name, { text: searchText.current })
      },
   })

   const onSearchTextChange = (text) => {
      searchText.current = text;
      publishSearchEvent()
   }

   const publishSearchEvent = () => {
      publishBusEvent(BUS_EVENTS.SEARCH_TEXT_CHANGE,
         {
            text: searchText.current,
            activeTab: activeTab.current
         }
      )
   }

   return (
      <View style={AppStyles.flex}>
         <Tab.Navigator
            // lazy={true}
            tabBarOptions={tabBarOptions}>
            <Tab.Screen
               name="Audio"
               component={Audio}
               listeners={onTabChange}
               options={{
                  tabBarLabel: 'Audio',
               }}
            />
            <Tab.Screen
               name="Video"
               component={Video}
               listeners={onTabChange}
               options={{
                  tabBarLabel: 'Video',
               }}
            />
            <Tab.Screen
               name="Artist"
               component={Artist}
               listeners={onTabChange}
               options={{
                  tabBarLabel: 'Accounts',
               }}
            />
            <Tab.Screen
               name="Genre"
               component={Genre}
               listeners={onTabChange}
               options={{
                  tabBarLabel: 'Genre',
               }}
            />
         </Tab.Navigator>
      </View>
   );
}

export default SearchTabs