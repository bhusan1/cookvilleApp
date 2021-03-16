import {combineReducers} from 'redux';
import {navigationRef} from '../../navigator';
import {firestoreReducer} from 'redux-firestore';
import {firebaseReducer} from 'react-redux-firebase';

export default combineReducers({
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    nav: (state) => {
        return {...state, ...navigationRef.current};
    },
});
