import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from './src/firebase/config'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


import MainTabScreen from './src/user/screens/MainTabScreen';


import { LoginScreen, HomeScreen, RegistrationScreen, ResetPassword } from './src/user/screens'

import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }



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
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Reset Password" component={ResetPassword} />
          <Stack.Screen name="MainTabScreen" component={MainTabScreen}/>
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
