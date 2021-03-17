import {applyMiddleware, createStore} from 'redux';

import rootReducer from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import firebase from '../firebase';
import {getFirestore, reduxFirestore} from 'redux-firestore';
import {getFirebase} from 'react-redux-firebase';
import thunk from 'redux-thunk';

export const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk.withExtraArgument({getFirestore, getFirebase})),
        reduxFirestore(firebase),
    ),
);
