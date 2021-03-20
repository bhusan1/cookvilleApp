import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';

import {TabNavigator} from './TabNavigator';
import {SignInScreen, SignUpScreen, ResetPasswordScreen, AddRecipeScreen, AddDealScreen, AllowNotificationScreen} from '../screens';
import {BackHandler, Platform} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {authCheck} from "../store/actions";
import {useDispatch, useSelector} from "react-redux";
const Stack = createStackNavigator();
export const navigationRef = React.createRef();
export const AppNavigator = () => {
    
    const theme = useTheme();
    const dispatch = useDispatch();
    
    const authUser = useSelector(state=>state.firebase.profile);
    
    const [appIsReady, setAppIsReady] = useState(false);
    const [initialScreen, setInitialScreen] = useState(null);
    
    useEffect(() => {
            (async () => {
                await SplashScreen.preventAutoHideAsync();
                
                await Font.loadAsync({
                    OpenSans: require('../assets/fonts/OpenSans-Regular.ttf'),
                    OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),
                });
                
                setAppIsReady(true);
            })();
            
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
        }
    
    }, []);
    
    useEffect(() => {
        if(appIsReady && authUser.isLoaded){
            (async () => {
                const isLoggedIn = await dispatch(authCheck());
        
                if(isLoggedIn){
                    if(authUser.muteNotifications){
                        setInitialScreen('AllowNotification')
                    }else {
                        setInitialScreen('UserBoard');
                    }
                }else {
                    setInitialScreen('SignIn')
                }
        
                await SplashScreen.hideAsync();
            })();
        }
    }, [authUser, appIsReady]);
    
    if(!initialScreen){
        return  null;
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
