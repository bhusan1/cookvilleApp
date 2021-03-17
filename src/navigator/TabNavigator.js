import React from 'react';
import {useTheme} from 'react-native-paper';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import {HomeScreen, DealsScreen, DeliScreen, SettingsScreen} from "../screens";
import {StatusBar} from "expo-status-bar";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const theme = useTheme();
    const route = useRoute();
    const routeName = getFocusedRouteNameFromRoute(route);
    return (
        <>
            <StatusBar style="light" backgroundColor={theme.colors.secondary} />
            <Tab.Navigator
                initialRouteName={'Home'}
                tabBarOptions={{
                    activeTintColor: theme.colors.primary,
                    inactiveTintColor: theme.colors.boarder,
                    style: {
                        backgroundColor:'#6e012a',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        shadowOffset: {width: 0, height: 0},
                    },
                    labelStyle: {
                        fontSize: 12,
                        fontWeight: '400',
                        paddingBottom: theme.hp('0.5%'),
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Icon name="ios-home" color={color} size={20} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Deals"
                    component={DealsScreen}
                    options={{
                        tabBarLabel: 'Deals',
                        tabBarIcon: ({ color }) => (
                            <Icon name="ios-notifications" color={color} size={20} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Deli"
                    component={DeliScreen}
                    options={{
                        tabBarLabel: 'Deli',
                        tabBarIcon: ({ color }) => (
                            <Icon name="fast-food" color={color} size={20} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <Icon name="ios-aperture" color={color} size={20} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    );
};
