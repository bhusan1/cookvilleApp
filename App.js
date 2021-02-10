import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from './src/firebase/config'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
/* import { createDrawerNavigator } from '@react-navigation/drawer';

import {DrawerContent} from './src/screens/inScreen/DrawerContent';
import DeliScreen  from './src/screens/inScreen/DeliScreen';
import DealsScreen  from './src/screens/inScreen/DealsScreen';
import SettingsScreen  from './src/screens/inScreen/SettingsScreen'; */

import MainTabScreen from './src/screens/MainTabScreen/MainTabScreen';


import { LoginScreen, HomeScreen, RegistrationScreen, ResetPassword } from './src/screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }



const Stack = createStackNavigator();
/* const Drawer = createDrawerNavigator(); */

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
      <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Reset Password" component={ResetPassword} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return(
    <NavigationContainer>
        <MainTabScreen/>
    </NavigationContainer>
  );
}

/* <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
            <Drawer.Screen name="DealsScreen" component={DealsScreen} />
            <Drawer.Screen name="DeliScreen" component={DeliScreen} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
          </Drawer.Navigator>
    </NavigationContainer>
); */