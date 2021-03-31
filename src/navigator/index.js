import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';

import {TabNavigator} from './TabNavigator';
import {SignInScreen, SignUpScreen, ResetPasswordScreen, AddRecipeScreen, AddDealScreen, AllowNotificationScreen} from '../screens';
const Stack = createStackNavigator();
export const navigationRef = React.createRef();
export const AppNavigator = () => {
    
    const theme = useTheme();
   
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={'Sample1'}
            >
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="UserBoard"
                    component={TabNavigator}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="AllowNotification"
                    component={AllowNotificationScreen}
                    options={{
                        header: () => null,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
