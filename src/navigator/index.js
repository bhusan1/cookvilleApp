import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {} from './TabNavigator';
import {
} from '../screens';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

export const AppNavigator = () => {

    const profile = useSelector(state=>state.firebase.auth.profile);

    const [initialScreen, setInitialScreen] = useState(null);

    if(!initialScreen){
        return  null;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={initialScreen}>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        header: () => null,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
