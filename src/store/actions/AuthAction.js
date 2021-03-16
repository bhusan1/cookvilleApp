import {showMessage} from 'react-native-flash-message';
/**
 * Redux Action To Signup User In Firebase
 */
export const signUpUserInFirebase = (user) => async (dispatch, getState, {getFirebase, getFirestore}) => {
    return new Promise((resolve) => {
        const firebase = getFirebase();
        firebase
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then((success) => {
                console.log(success);
                const firestore = getFirestore();
                firestore
                    .collection('users')
                    .doc(success.user.uid)
                    .set({
                        email: user.email,
                        createdAt: firestore.FieldValue.serverTimestamp(),
                        role: 'user',
                        uid: success.user.uid,
                    })
                    .then(async () => {
                        showMessage({
                            message: 'Success',
                            description: 'You are signed in now!',
                            type: 'success',
                        });
                        resolve(true);
                    });
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
