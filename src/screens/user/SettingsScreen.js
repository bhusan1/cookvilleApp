import React from 'react';
import {Text, StyleSheet, SafeAreaView, StatusBar, View, Switch} from 'react-native';

import {Button} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {userLogout} from '../../store/actions';
import {useFirestore} from "react-redux-firebase";

export const SettingsScreen = () => {
    
    const firestore = useFirestore();
    const dispatch = useDispatch();
    const authUser = useSelector(state=>state.firebase.profile);
    const [muteNotifications, setMuteNotifications] = React.useState(authUser.muteNotification || false);
    
    const signOut = () => {
        dispatch(userLogout());
    };
    
    const handleMuteNotifications = async () => {
        setMuteNotifications(!muteNotifications);
        await firestore.collection('users').doc(authUser.uid).update({muteNotifications});
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.content}>
                <View style={styles.settingItem}>
                    <View style={[styles.settingItemContent,{flexDirection:'column'}]}>
                        <Text>Profile</Text>
                        
                    </View>
                </View>
                <View style={styles.settingItem}>
                    <View style={styles.settingItemContent}>
                        <Text>Mute Notification</Text>
                        <Switch
                            trackColor={{ false: "#a4a4a4", true: "#35c759" }}
                            thumbColor={muteNotifications ? "white" : "white"}
                            ios_backgroundColor="#a4a4a4"
                            onValueChange={handleMuteNotifications}
                            value={muteNotifications}
                        />
                    </View>
                </View>
            </View>
            <Button title="Sign Out" onPress={signOut} />
            <Text style={styles.text}> Once signed out, requires password to login again</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
        marginTop: StatusBar.currentHeight,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    content:{
      backgroundColor:'#efefef',
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
    },
    settingItem:{
        paddingBottom: 15,
        overflow:'hidden',
    },
    settingItemContent:{
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        backgroundColor:'white',
        elevation: 15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    }
});
