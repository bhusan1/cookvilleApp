import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';

import {TabNavigator} from './TabNavigator';
import {SignInScreen, SignUpScreen, ResetPasswordScreen, AddRecipeScreen, AddDealScreen, AllowNotificationScreen, SplashScreen} from '../screens';
import * as ExpoSplashScreen from "expo-splash-screen";
const Stack = createStackNavigator();
export const navigationRef = React.createRef();
export const AppNavigator = () => {

    const theme = useTheme();

    useEffect(() => {
            (async () => {
                await ExpoSplashScreen.preventAutoHideAsync();
            })();
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={'Splash'}
            >
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{
                        header: () => null,
                    }}
                />
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
