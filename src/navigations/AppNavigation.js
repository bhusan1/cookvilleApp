import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';


import IMDrawerMenu from '../Core/ui/drawer/IMDrawerMenu/IMDrawerMenu'

import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../Core/onboarding/LoginScreen/LoginScreen';
import SignupScreen from '../Core/onboarding/SignupScreen/SignupScreen';
import WelcomeScreen from '../Core/onboarding/WelcomeScreen/WelcomeScreen';
import LoadScreen from '../Core/onboarding/LoadScreen/LoadScreen';
import ResetPasswordScreen from '../Core/onboarding/ResetPasswordScreen/ResetPasswordScreen';

import DynamicAppStyles from '../DynamicAppStyles';
import AppConfig from '../VendorAppConfig';

import { View, StyleSheet, TouchableOpacity } from 'react-native';

import stripe from 'tipsi-stripe';

import { useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import authManager from '../Core/onboarding/utils/authManager';

stripe.setOptions({
  publishableKey: AppConfig.STRIPE_CONFIG.PUBLISHABLE_KEY,
  merchantId: AppConfig.STRIPE_CONFIG.MERCHANT_ID,
});

const Main = createStackNavigator();
const MainNavigation = () => {
  const colorScheme = useColorScheme();
  return (
    <Main.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleStyle: {
          fontFamily: 'FallingSkyCond',
        },
        headerStyle: {
          backgroundColor:
            DynamicAppStyles.navThemeConstants[colorScheme].backgroundColor,
        },
        headerTintColor: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
      })}
      initialRouteName="Home"
      headerMode="float">
      <Main.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: AppConfig,
        }}
        name="Home"
        component={HomeScreen}
      />
      <Main.Screen name="Settings" component={SettingsScreen} />
    </Main.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const DrawerStack = (props) => {
  const drawer = <IMDrawerMenu
                    navigation={props.navigation}
                    menuItems={AppConfig.drawerMenuConfig.customerDrawerConfig.upperMenu}
                    menuItemsSettings={AppConfig.drawerMenuConfig.customerDrawerConfig.lowerMenu}
                    appStyles={DynamicAppStyles}
                    authManager={authManager}
                    appConfig={AppConfig}
                  />;
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerStyle={{ width: 250 }}
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        drawer
      )}>
      <Drawer.Screen name="Main" component={MainNavigation} />
    </Drawer.Navigator>
  );
};

const AdminDrawer = createDrawerNavigator();
const AdminDrawerStack = (props) => {
  return (
    <AdminDrawer.Navigator
      drawerPosition="left"
      drawerStyle={{ width: 250 }}
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        <IMDrawerMenu
          navigation={props.navigation}
          menuItems={AppConfig.drawerMenuConfig.adminDrawerConfig.upperMenu}
          menuItemsSettings={AppConfig.drawerMenuConfig.adminDrawerConfig.lowerMenu}
          appStyles={DynamicAppStyles}
          authManager={authManager}
          appConfig={AppConfig}
        />
      )}>
      <AdminDrawer.Screen name="Main" component={MainNavigation} />
    </AdminDrawer.Navigator>
  );
};

const Login = createStackNavigator();
const LoginStack = () => {
  return (
    <Login.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome">
      <Login.Screen name="Login" component={LoginScreen} />
      <Login.Screen name="Signup" component={SignupScreen} />
      <Login.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: AppConfig,
          authManager: authManager
        }}
        name="Welcome"
        component={WelcomeScreen}
      />
      {/* <Login.Screen name="Sms" component={SmsAuthenticationScreen} /> */}
      <Login.Screen name="ResetPassword"
        component={ResetPasswordScreen}
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: AppConfig,
          authManager: authManager
        }}
      />
    </Login.Navigator>
  );
};

const RootStack = createStackNavigator();
const RootNavigator = () => {
  const currentUser = useSelector((state) => state.auth.user);
  console.log(currentUser.role);
  return (
    <RootStack.Navigator
      initialRouteName="LoadScreen"
      screenOptions={{ headerShown: false, animationEnabled: false }}
      headerMode="none">
      <RootStack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: AppConfig,
          authManager: authManager
        }}
        options={{ headerShown: false }}
        name="LoadScreen"
        component={LoadScreen}
      />
      {/* role based login */}
      <RootStack.Screen
        options={{ headerShown: false }}
        name="LoginStack"
        component={LoginStack}
      />
      {currentUser?.role === 'admin' ? (
        <RootStack.Screen
          options={{ headerShown: false }}
          name="MainStack"
          component={AdminDrawerStack}
        />
      ) : (
        <RootStack.Screen
          options={{ headerShown: false }}
          name="MainStack"
          component={DrawerStack}
        />
      )}
    </RootStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export { RootNavigator, AppNavigator };

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapImage: { width: 25, height: 25 },
});
