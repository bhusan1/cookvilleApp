import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export const registerForPushNotifications = () => async (dispatch, getState, {getFirebase, getFirestore}) => {
    try {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        getFirestore().collection('tokens').doc(token).set({
            user: getFirebase().profile.uid,
            token: token
        }).then(()=>{
            console.log('Success');
        })
    }catch (e) {
        console.log(e);
        alert('Something with Notification settings')
    }
    
    if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
            badge: true,
        });
    }
}

const sendPushNotification = (body) => {
    return async (dispatch, getState) => {
        const tokens = (getState().firestore.ordered.tokens || []).reduce((result, item) => {
            return result.push(item.token)
        }, []);
        const message = {
            to: tokens,
            sound: 'default',
            title: '',
            body: body,
            _displayInForeground: true,
        };
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };
};
