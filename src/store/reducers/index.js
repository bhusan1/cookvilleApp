import {combineReducers} from 'redux';
import {navigationRef} from '../../navigator';
import {firestoreReducer} from 'redux-firestore';
import {firebaseReducer} from 'react-redux-firebase';
import { authReducer } from "./AuthReducer";

export default combineReducers({
    auth: authReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    nav: (state) => {
        return {...state, ...navigationRef.current};
    },
});
