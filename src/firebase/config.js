import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAWzsPglgq6rpHO_EuEtSVzWFcStAR9txM",
    authDomain: "cookville1stop-22333.firebaseapp.com",
    databaseURL: "https://cookville1stop-22333-default-rtdb.firebaseio.com",
    projectId: "cookville1stop-22333",
    storageBucket: "cookville1stop-22333.appspot.com",
    messagingSenderId: "599155764226",
    appId: "1:599155764226:web:1e0bb7087e57c801690b1b",
    measurementId: "G-1PSV8G6840"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
