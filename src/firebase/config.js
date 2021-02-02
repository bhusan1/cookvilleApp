import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB19En55bfb7wyZFLl3SbwaAYG_jeCmuDo",
    authDomain: "cookvilleapp.firebaseapp.com",
    projectId: "cookvilleapp",
    storageBucket: "cookvilleapp.appspot.com",
    messagingSenderId: "807157153925",
    appId: "1:807157153925:web:330a83680eda2fed8a69ec",
    measurementId: "G-GX2KWFMT6K"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };