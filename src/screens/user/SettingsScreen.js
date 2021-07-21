import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, View, Switch, ScrollView, StatusBar} from 'react-native';

import {Avatar, Button, Input} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {userLogout} from '../../store/actions';
import {useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {useTheme} from "react-native-paper";
import {showMessage} from "react-native-flash-message";
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

const INITIAL_STATE = {
    regular: 0,
    plus: 0,
    super: 0,
    diesel: 0,
}

export const SettingsScreen = ({navigation}) => {

    useFirestoreConnect([{collection:'settings', doc: 'gasPrice', storeAs: 'gasPrice'}])

    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const firestore = useFirestore();
    const dispatch = useDispatch();
    const authUser = useSelector(state=>state.firebase.profile);
    const [muteNotifications, setMuteNotifications] = React.useState(authUser.muteNotification || false);
    const [price, setPrice] = useState(useSelector(state=>state.firestore.data.gasPrice || INITIAL_STATE))

    const signOut = () => {
        dispatch(userLogout()).then(()=>{
            navigation.reset({index:0, routes:[{name:'Home'}]});
        });
    };

    const handleMuteNotifications = async () => {
        setMuteNotifications(!muteNotifications);
        await firestore.collection('users').doc(authUser.uid).update({muteNotifications: !muteNotifications});
    }

    const handleChange = (name, value) => {
        setPrice({...price, [name]: value});
    }

    const submitGasPrice = () => {
        firestore.collection('settings').doc('gasPrice').set(price).then(()=>{
            showMessage({
                message: 'Success',
                description: 'Gas Price Updated',
                type: 'success',
            })
        })
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle={'light-content'}/>
            <View style={[styles.statusBar, {height: insets.top}]}/>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.settingItem}>
                        <View style={[styles.settingItemContent,{justifyContent:'flex-start'}]}>
                            <Avatar />
                            <View style={{marginLeft: 20}}>
                                <Text>{authUser.fullName}</Text>
                                <Text style={{marginTop: 3}}>{authUser.email}</Text>
                                <Text style={{marginTop: 3}}>{authUser.phoneNumber}</Text>
                            </View>
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

                    {/*need to add functions for Track Order and Order History */}
                    <View style={styles.settingItem}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('TrackOrder')}}>
                        <Text style={styles.settingItemContent}> Track Order</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.settingItem}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('OrderHistory')}}>
                        <Text style={styles.settingItemContent}> Order History</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        authUser.role === 'admin' &&
                        <View style={styles.settingItem}>
                            <View style={[styles.settingItemContent, {flexDirection:'column'}]}>
                                <Text style={theme.styles.h2}>Gas Prices</Text>
                                <View style={styles.gasPriceItem}>
                                    <View style={styles.inputContainer}>
                                        <Input style={styles.inputStyle}  onChangeText={handleChange} value={price.regular} name={'regular'}/>
                                        <Text> $/gal</Text>
                                    </View>
                                    <Text>Regular</Text>
                                </View>
                                <View style={styles.gasPriceItem}>
                                    <View style={styles.inputContainer}>
                                        <Input style={styles.inputStyle} onChangeText={handleChange} value={price.plus} name={'plus'}/>
                                        <Text> $/gal</Text>
                                    </View>
                                    <Text>Plus</Text>
                                </View>
                                <View style={styles.gasPriceItem}>
                                    <View style={styles.inputContainer}>
                                        <Input style={styles.inputStyle}  onChangeText={handleChange} value={price.super} name={'super'}/>
                                        <Text> $/gal</Text>
                                    </View>
                                    <Text>Super</Text>
                                </View>
                                <View style={styles.gasPriceItem}>
                                    <View style={styles.inputContainer}>
                                        <Input style={styles.inputStyle}  onChangeText={handleChange} value={price.diesel} name={'diesel'}/>
                                        <Text> $/gal</Text>
                                    </View>
                                    <Text>Diesel</Text>
                                </View>
                                <Button style={{width: 120}} title={'Save'} onPress={submitGasPrice}/>
                            </View>
                        </View>
                    }

                    <View style={{paddingHorizontal: 30, backgroundColor:'white'}}>
                        <Button title="Sign Out" onPress={signOut} />
                        <Text style={styles.text}> Once signed out, requires password to login again</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
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
    statusBar:{
        position:'absolute',
        top: 0,
        width:'100%',
        backgroundColor:theme.colors.main,
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
    },
    gasPriceItem:{
        flexDirection: 'row',
        width:'100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputContainer:{
        width: '30%',
        flexDirection:'row',
        alignItems:'center',
    },
    inputStyle:{
        width:'100%',
        height: 30,
    }
});
