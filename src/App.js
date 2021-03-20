import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {AppNavigator} from './navigator';

import {store} from './store';

// Message
import FlashMessage from 'react-native-flash-message';

// theme
import {Provider as PaperProvider} from 'react-native-paper';
import theme from './theme';

// firebase
import firebase from './firebase';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase';
import {createFirestoreInstance} from 'redux-firestore';

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
};

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance: createFirestoreInstance,
};

export default function App() {
    
    
    return (
        <PaperProvider theme={theme}>
            <Provider store={store}>
                <ReactReduxFirebaseProvider {...rrfProps}>
                    <StatusBar barStyle={'light'} backgroundColor={'#6e012a'} />
                    <AppNavigator />
                    <FlashMessage position="top" />
                </ReactReduxFirebaseProvider>
            </Provider>
        </PaperProvider>
    );
}
