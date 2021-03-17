import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';
import {authCheck} from '../store/actions';

import {TabNavigator} from './TabNavigator';
import {SignInScreen, SignUpScreen, ResetPasswordScreen, AddRecipeScreen, AddDealScreen, AllowNotificationScreen} from '../screens';
const Stack = createStackNavigator();

export const navigationRef = React.createRef();

export const AppNavigator = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const authUser = useSelector(state=>state.firebase.profile);
    
    const [initialScreen, setInitialScreen] = useState(null);

    useEffect(() => {
        dispatch(authCheck()).then((isLoggedIn) => {
            if (isLoggedIn) {
                if(authUser.isLoaded){
                    if(authUser.muteNotifications){
                        setInitialScreen('AllowNotification')
                    }else {
                        setInitialScreen('UserBoard');
                    }
                }
            } else {
                setInitialScreen('SignIn');
            }
        });
    }, [authUser]);

    if (!initialScreen) {
        return null;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={initialScreen}
            >
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
                <Stack.Screen
                    name="AllowNotification"
                    component={AllowNotificationScreen}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="AddRecipe"
                    component={AddRecipeScreen}
                    options={{
                        headerTitle: 'Recipe',
                        headerBackTitle: 'Back',
                        headerTintColor: 'white',
                        headerStyle: {
                            backgroundColor: theme.colors.secondary,
                        },
                    }}
                />
                <Stack.Screen
                    name="AddDeal"
                    component={AddDealScreen}
                    options={{
                        headerTitle: 'Deal',
                        headerBackTitle: 'Back',
                        headerTintColor: 'white',
                        headerStyle: {
                            backgroundColor: theme.colors.secondary,
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
