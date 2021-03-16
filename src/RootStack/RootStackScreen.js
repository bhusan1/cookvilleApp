import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ResetPassword from './ResetPassword/ResetPassword';
import RegistrationScreen from './RegistrationScreen/RegistrationScreen';
import LoginScreen from './LoginScreen/LoginScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="LoginScreen" component={LoginScreen}/>
        <RootStack.Screen name="RegistrationScreen" component={RegistrationScreen}/>
        <RootStack.Screen name="ResetPassword" component={ResetPassword}/>
    </RootStack.Navigator>
);

export default RootStackScreen;