import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MasseurTabNavigator, ClientTabNavigator} from './TabNavigators';
import {
} from '../screens';
import {useDispatch, useSelector} from 'react-redux';

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

const AppNavigator = () => {

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
                <Stack.Screen
                    name="SelectProfile"
                    component={SelectProfileScreen}
                    options={{
                        header: () => null,
                    }}
                />
                <Stack.Screen
                    name="OpenGPS"
                    component={OpenGPSScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Confirm GPS',
                    }}
                />
                <Stack.Screen
                    name="ConfirmAge"
                    component={ConfirmAgeScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Age',
                    }}
                />
                <Stack.Screen
                    name="PhoneNumber"
                    component={PhoneNumberScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Phone Number',
                    }}
                />
                <Stack.Screen
                    name="Verify"
                    component={VerifyScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Verify',
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Sign Up',
                    }}
                />
                <Stack.Screen
                    name="UploadMedia"
                    component={UploadMediaScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Upload Media',
                    }}
                />

                <Stack.Screen
                    name="PhysicalCharacteristics"
                    component={PhysicalCharacteristicsScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Physical Characteristics',
                    }}
                />

                <Stack.Screen
                    name="SelectService"
                    component={SelectServiceScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Service offered',
                    }}
                />

                <Stack.Screen
                    name="PricingService"
                    component={PricingServiceScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Pricing Service',
                    }}
                />

                <Stack.Screen
                    name="Comment"
                    component={CommentScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Comment',
                    }}
                />

                <Stack.Screen
                    name="ThankYou"
                    component={ThankYouScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Welcome',
                    }}
                />

                <Stack.Screen
                    name="ProfileEdit"
                    component={ProfileEditScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Profile Update',
                    }}
                />
                <Stack.Screen
                    name="Masseur"
                    component={MasseurTabNavigator}
                    options={{
                        header: () => null,
                    }}
                />

                <Stack.Screen
                    name="Client"
                    component={ClientTabNavigator}
                    options={{
                        header: () => null,
                    }}
                />

                <Stack.Screen
                    name="QRSuccess"
                    component={QRSuccessScreen}
                    options={{
                        header: () => null,
                    }}
                />

                <Stack.Screen
                    name="QRFailed"
                    component={QRFailedScreen}
                    options={{
                        header: () => null,
                    }}
                />

                <Stack.Screen
                    name="ClientLogin"
                    component={ClientLoginScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Sign In',
                    }}
                />

                <Stack.Screen
                    name="ClientSignUp"
                    component={ClientSignUpScreen}
                    options={{
                        headerBackTitle: null,
                        headerTitle: 'Sign Up',
                    }}
                />

                <Stack.Screen
                    name="ClientVerify"
                    component={ClientVerifyScreen}
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Verify Code',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
