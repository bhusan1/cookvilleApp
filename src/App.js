import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Provider} from 'react-redux';
import {store} from "./store";
import {AppNavigator} from './navigator';

// Message
import FlashMessage from 'react-native-flash-message';

// theme
import {Provider as PaperProvider} from 'react-native-paper';
import theme from './theme';

// firebase
import firebase from './firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore'

import {Platform, BackHandler} from "react-native";

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance: createFirestoreInstance
}

export default function App() {
    useEffect(()=>{
        if(Platform.OS === 'android'){
            BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
        }

    },[])
    return (
        <PaperProvider theme={theme}>
            <Provider store= {store}>
                <ReactReduxFirebaseProvider {...rrfProps}>
                    <StatusBar barStyle={'light'} backgroundColor={'white'} />
                    <AppNavigator />
                    <FlashMessage position="top" />
                </ReactReduxFirebaseProvider>
            </Provider>
        </PaperProvider>
    );
}
