import React from 'react';
import {useTheme} from 'react-native-paper';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {HomeScreen} from "../screens";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const theme = useTheme();
    const route = useRoute();
    const initialRoute = route.params?.initialRoute;
    const routeName = getFocusedRouteNameFromRoute(route);
    return (
        <Tab.Navigator
            initialRouteName={initialRoute || 'Filter'}
            tabBarOptions={{
                activeTintColor: theme.colors.primary,
                inactiveTintColor: theme.colors.default,
                showLabel: true,
                style: {
                    borderTopWidth: 0,
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
            screenOptions={{
                header: () => null,
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color}) => (
                        <Icon image={routeName === 'ClientProfile' ? iconUserActive : iconUser} size={18} />
                    ),
                }}
            />
            <Tab.Screen
                name="Filter"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Deals',
                }}
            />
            <Tab.Screen
                name="ClientMessage"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Setting',
                }}
            />
        </Tab.Navigator>
    );
};
