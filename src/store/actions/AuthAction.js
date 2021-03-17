import {showMessage} from 'react-native-flash-message';

export const USER_LOG_OUT = 'USER_LOG_OUT';

/**
 * Redux Action To Signup User In Firebase
 */

let unsubscribes = [];
export const signUpUserInFirebase = (user) => async (dispatch, getState, {getFirebase, getFirestore}) => {
    return new Promise((resolve) => {
        const firebase = getFirebase();
        firebase
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then((success) => {
                const firestore = getFirestore();
                const unsubscribe = firestore
                    .collection('users')
                    .doc(success.user.uid)
                    .set({
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        role: 'customer',
                        uid: success.user.uid,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                    })
                    .then(async () => {
                        showMessage({
                            message: 'Success',
                            description: 'You are signed in now!',
                            type: 'success',
                        });
                        resolve(true);
                    });
                unsubscribes.push(unsubscribe);
            })
            .catch((error) => {
                console.log(error);
                showMessage({
                    message: 'Something went wrong',
                    description: error.message,
                    type: 'success',
                });
                resolve(false);
            });
    });
};


export const signInWithFirebase = (user) => (dispatch, getState, {getFirestore, getFirebase}) => {
    return new Promise((resolve) => {
        getFirebase()
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(({user}) => {
                showMessage({
                    message: 'Sign In Success',
                    description: 'You are logged in now',
                    type: 'success',
                });
            })
            .catch((error) => {
                showMessage({
                    message: 'Something went wrong',
                    description: error.message,
                    type: 'error',
                });
                console.log(error);
                resolve(false);
            });
    });
};

export const userLogout = () => async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    await firebase.auth().signOut();
    unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
    });
    getState().nav.reset({index: 0, routes: [{name: 'UserBoard'}]});
};

/**
 *Send Email for verify Code and Password
 */
export const sendEmailForRecovery = (email) => (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
            showMessage({
                message: 'Success',
                description: 'Please check your email',
                type: 'success',
            });
        })
        .catch(function (error) {});
};
