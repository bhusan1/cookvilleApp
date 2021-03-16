import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from './src/firebase/config'

import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack'

import { DrawerContent } from './src/user/screens/DrawerContent';
import MainTabScreen from './src/user/screens/MainTabScreen';
import DealsScreen from './src/user/screens/DealsScreen';
import SettingsScreen from './src/user/screens/SettingsScreen';
import DeliScreen from './src/user/screens/DeliScreen';

import RootStackScreen from './src/RootStack/RootStackScreen';

import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) return null;

  if (!user) {
    return(
      <NavigationContainer>
        <RootStackScreen/> 
      </NavigationContainer>
    );
  }

  return(
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          <Drawer.Screen name="DealsScreen" component={DealsScreen} />
          <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
          <Drawer.Screen name="DeliScreen" component={DeliScreen} />
      </Drawer.Navigator>
    
    </NavigationContainer>
  );
}
