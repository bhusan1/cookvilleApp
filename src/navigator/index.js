import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';

import {TabNavigator} from './TabNavigator';
import {
    SignInScreen,
    SignUpScreen,
    ResetPasswordScreen,
    AddRecipeScreen,
    AddDealScreen,
    AllowNotificationScreen,
    ThankYouOrderScreen,
    TrackOrder,
    OrderHistoryScreen,
} from '../screens';
const Stack = createStackNavigator();
export const navigationRef = React.createRef();
export const AppNavigator = () => {

    const theme = useTheme();

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={'UserBoard'}
            >
                <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{
                        headerBackTitle:'Home'
                    }}
                />
                <Stack.Screen
                    name="ThankYou"
                    component={ThankYouOrderScreen}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="OrderHistory"
                    component={OrderHistoryScreen}
                    options={{
                        headerBackTitle:'Back',
                        headerTitle:'Order History'
                    }}
                />
                <Stack.Screen
                    name="TrackOrder"
                    component={TrackOrder}
                    options={{
                        headerBackTitle:'Back',
                        headerTitle:'Track Order'
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
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
