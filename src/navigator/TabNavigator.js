import React from 'react';
import {useTheme} from 'react-native-paper';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import {HomeScreen} from "../screens";
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const theme = useTheme();
    const route = useRoute();
    const initialRoute = route.params?.initialRoute;
    const routeName = getFocusedRouteNameFromRoute(route);
    return (
        <Tab.Navigator
            initialRouteName={'Home'}
            activeColor="#fff"
            tabBarOptions={{
                activeTintColor: theme.colors.primary,
                inactiveTintColor: theme.colors.default,
                showLabel: true,
                style: {
                    backgroundColor:'#6e012a',
                },
                labelStyle: {
                    fontSize: 12,
                    fontWeight: '400',
                    paddingBottom: theme.hp('0.5%'),
                },
            }}
            screenOptions={{
                header: () => null,
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Deals"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Deals',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-notifications" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Deli"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Deli',
                    tabBarIcon: ({ color }) => (
                        <Icon name="fast-food" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-aperture" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
