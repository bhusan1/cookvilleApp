import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {TabNavigator} from './TabNavigator';
import {
    SignInScreen
} from '../screens';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

export const AppNavigator = () => {

    const profile = useSelector(state=>state.firebase.profile);

    let  initialScreen = null;

    if(!profile.isLoaded){
        return  null;
    }else {
        initialScreen = profile.isEmpty ? 'SignIn' : 'UserBoard';
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={initialScreen}>
                <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};
