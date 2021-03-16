import React, {useEffect, useState} from 'react';
import {store} from "./store";
import {Provider} from 'react-redux';
import {AppNavigator} from './navigator';
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

        (async()=>{
            await  Font.loadAsync({
                'Helvetica': require('./fonts/Helvetica.ttf'),
                'Lalezar': require('./fonts/Lalezar.ttf')
            })
        })();

    },[])
    return (
        <Provider store= {store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <AppNavigator />
            </ReactReduxFirebaseProvider>
        </Provider>
    );
}
