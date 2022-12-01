import React, { useEffect } from 'react'
import { View, } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { tabBarOptions } from './options';
import { AppStyles } from '../../theme';
import Followers from './Followers'
import Follow from '../Follow'
import Following from './Following'
import { getUser } from '../../CommonApis';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Tab = createMaterialTopTabNavigator();

const FollowersFollowingTabs = (props) => {
   const { navigation, route: { params } } = props;
   const loginUsr = useSelector(({ user }) => user.data);
   const [user, setUser] = useState(params.user);
   useEffect(() => {
      const countAgain = props.navigation.addListener('focus', () => {
         getUser(params.user.slug, (user) => {
            setUser(s => user)
         })
      });
      navigation.setParams({ title: user.name })
      return () => { countAgain.remove() }
   }, []);

   useEffect(() => {
      if (loginUsr.id == params.user.id) {
         setUser(s => loginUsr);
      }
   }, [loginUsr])

   return (
      <View style={AppStyles.flex}>
         <Tab.Navigator
            lazy={true}
            tabBarOptions={tabBarOptions}>
            <Tab.Screen
               name="Followers"
               component={Followers}
               options={{
                  tabBarLabel: `${user.no_of_followers} Followers`
               }}
               initialParams={{ user }}
            />
            <Tab.Screen
               name="Following"
               component={Following}
               options={{
                  tabBarLabel: `${user.no_of_following} Following`
               }}
               initialParams={{ user }}
            />
         </Tab.Navigator>
      </View>
   );
}



export default FollowersFollowingTabs
