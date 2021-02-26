import { firebaseAuth } from '../../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { ErrorCode } from './ErrorCode';
import Geolocation from '@react-native-community/geolocation';


const loginWithEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithEmailAndPassword(email, password).then((response) => {
      if (!response.error) {
        handleSuccessfulLogin({ ...response.user }, false).then((res) => {
          // Login successful, push token stored, login credential persisted, so we log the user in.
          resolve({ user: res.user });
        });
      } else {
        resolve({ error: response.error });
      }
    });
  });
};

const onVerification = (phone) => {
  firebaseAuth.onVerificationChanged(phone);
};

const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
  
  const accountCreationTask = (userData) => {
    return new Promise((resolve, _reject) => {
      firebaseAuth
        .register(userData, appConfig.appIdentifier)
        .then(async (response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            let user = response.user;
              resolve({
                user: {
                  ...response.user, 
                },
              });
            }
        });
    });
  };

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve({
            ...response,
          });
        });
      }
    });
  });
};

/* const retrievePersistedAuthUser = () => {
  return new Promise((resolve) => {
    firebaseAuth.retrievePersistedAuthUser().then((user) => {
      if (user) {
        handleSuccessfulLogin(user, false).then((res) => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          resolve({
            user: res.user,
          });
        });
      } else {
        resolve(null);
      }
    });
  });
}; */

const sendPasswordResetEmail = (email) => {
  return new Promise((resolve) => {
    firebaseAuth.sendPasswordResetEmail(email);
    resolve();
  });
};

const logout = (user) => {
  const userData = {
    ...user,
    isOnline: false,
  };
  firebaseAuth.updateUser(user.id || user.userID, userData);
  firebaseAuth.logout();
};



/* const retrieveUserByPhone = (phone) => {
  return firebaseAuth.retrieveUserByPhone(phone);
};

const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  return firebaseAuth.sendSMSToPhoneNumber(phoneNumber, captchaVerifier);
};

const loginWithSMSCode = (smsCode, verificationID) => {
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithSMSCode(smsCode, verificationID).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // successful phone number login, we fetch the push token
        handleSuccessfulLogin(response.user, false).then((response) => {
          resolve(response);
        });
      }
    });
  });
}; */



const handleSuccessfulLogin = (user, accountCreated) => {
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  fetchAndStoreExtraInfoUponLogin(user, accountCreated);
  return new Promise((resolve) => {
    resolve({ user: { ...user } });
  });
};

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  firebaseAuth.fetchAndStorePushTokenIfPossible(user);

  getCurrentLocation(Geolocation).then(async (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    var locationData = {};
    if (location) {
      locationData = {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      };
      if (accountCreated) {
        locationData = {
          ...locationData,
          signUpLocation: {
            latitude: latitude,
            longitude: longitude,
          },
        };
      }
    }

    const userData = {
      ...locationData,
      isOnline: true,
    };

    firebaseAuth.updateUser(user.id || user.userID, userData);
  });
};

const getCurrentLocation = (geolocation) => {
  return new Promise(async (resolve) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } });
      return;
    }

    geolocation.getCurrentPosition(
      (location) => {
        console.log(location);
        resolve(location);
      },
      (error) => {
        console.log(error);
      },
    );

    // setRegion(location.coords);
    // onLocationChange(location.coords);

    // geolocation.getCurrentPosition(
    //     resolve,
    //     () => resolve({ coords: { latitude: "", longitude: "" } }),
    //     { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    // );
  });
};

const authManager = {
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
  createAccountWithEmailAndPassword,
  onVerification,
};

/* const authManager = {
    retrievePersistedAuthUser,
    loginWithEmailAndPassword,
    sendPasswordResetEmail,
    logout,
    createAccountWithEmailAndPassword,
    sendSMSToPhoneNumber,
    loginWithSMSCode,
    registerWithPhoneNumber,
    retrieveUserByPhone,
    onVerification,
  }; */

export default authManager;
