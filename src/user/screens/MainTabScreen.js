import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import DealsScreen from '../inScreen/DealsScreen';
import DeliScreen from '../inScreen/DeliScreen';
import SettingsScreen from './SettingsScreen';

const HomeStack = createStackNavigator();
const DealsStack = createStackNavigator();
const DeliStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#6e012a',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsStackScreen}
        options={{
          tabBarLabel: 'Deals',
          tabBarColor: '#6e012a',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-notifications" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Deli"
        component={DeliStackScreen}
        options={{
          tabBarLabel: 'Deli',
          tabBarColor: '#6e012a',
          tabBarIcon: ({ color }) => (
            <Icon name="fast-food" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarColor: '#6e012a',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-aperture" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({}) => (
      <HomeStack.Navigator screenOptions={{
              headerStyle: {
              backgroundColor: '#6e012a',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
              fontWeight: 'bold',
              }
          }}>
              <HomeStack.Screen name="Home" component={HomeScreen} options={{
              title:'Overview', headerTitleAlign: 'center'}} />
      </HomeStack.Navigator>
);

const DealsStackScreen = ({}) => (
        <DealsStack.Navigator screenOptions={{
                headerStyle: {
                backgroundColor: '#6e012a',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold'
                }
            }}>
                <DealsStack.Screen name="Deals" component={DealsScreen} options={{ headerTitleAlign: 'center',}} />
        </DealsStack.Navigator>
);

const DeliStackScreen = ({}) => (
        <DeliStack.Navigator screenOptions={{
                headerStyle: {
                backgroundColor: '#6e012a',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold'
                }
            }}>
                <DeliStack.Screen name="Deli" component={DeliScreen} options={{ headerTitleAlign: 'center' }} />
        </DeliStack.Navigator>
);

const SettingsStackScreen = ({}) => (
        <SettingsStack.Navigator screenOptions={{
                headerStyle: {
                backgroundColor: '#6e012a',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold'
                }
              }}>
                <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ headerTitleAlign: 'center'}} />
        </SettingsStack.Navigator>
);

