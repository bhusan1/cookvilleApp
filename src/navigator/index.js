import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {authCheck} from "../store/actions/AuthAction";

import {TabNavigator} from './TabNavigator';
import {
    SignInScreen,
    SignUpScreen,
    ResetPasswordScreen,
} from '../screens';
const Stack = createStackNavigator();

export const navigationRef = React.createRef();

export const AppNavigator = () => {

    const dispatch = useDispatch();

    const [initialScreen, setInitialScreen] = useState(null);

    useEffect(()=>{
        dispatch(authCheck()).then(isLoggedIn=>{
            if (isLoggedIn){
                setInitialScreen('UserBoard')
            }else {
                setInitialScreen('SignIn')
            }
        })
    },[])

    if(!initialScreen){
        return  null;
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};
