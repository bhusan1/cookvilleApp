import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Button, Input } from "../../components";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import {useFirebase, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import uuid from 'react-native-uuid';
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import {showMessage} from 'react-native-flash-message';
import {useSelector} from "react-redux";

const INITIAL_SATE = {
    title: '',
    image: '',
};

export const AddDealScreen = () => {
    
    useFirestoreConnect([{collection:'tokens'}]);
    
    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();
    
    const tokens = useSelector(state=>state.firestore.ordered.tokens || []);
    
    const [deal, setDeal] = useState(INITIAL_SATE);
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false);
    
    const submit = () => {
        if(validate(deal,{title:'required', image: 'required'})){
            setLoading(true);
            firestore.collection('recipes').add(deal).then(async ()=>{
                await sendPushNotification();
                showMessage({
                    message: 'Success',
                    description: 'Deal created successfully!',
                    type: 'success',
                });
                setLoading(false);
            })
        }
    }
    
    const openImagePickerAsync = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid.v4() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/deals/${fileName}`)
                    .put(blob).on(
                    "state_changed",
                    (snapshot )=> {
                        setProgress(Math.floor(snapshot.bytesTransferred/snapshot.totalBytes * 100));
                    },
                    (error) => {
                        console.log(error);
                    },
                    ()=>{
                        firebase.storage()
                            .ref("deals/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                setDeal({...deal, image: url});
                                setProgress(0);
                                setLoading(false);
                            })
                    }
                )
            }
        });
        
    };
    
    const sendPushNotification = async () => {
        const message = {
            to: tokens,
            sound: 'default',
            title: 'Deal Created',
            body: deal.title + 'added',
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
    }
    
    return (
        <View style={styles.root} >
            <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
            <View style={styles.content}>
                <Input
                    name={'title'}
                    onChangeText={(name, value)=>setDeal({...deal, [name]: value})}
                    placeholder={'Title'}
                />
                {
                    deal.image?
                        <View style={styles.imagePicker}>
                            <Image style={styles.image} source={{uri: deal.image}}/>
                        </View>:
                        <TouchableOpacity style={styles.imagePicker} onPress={openImagePickerAsync}>
                            <AntDesign name={'camera'} size={theme.wp('20%')} color={'white'} />
                        </TouchableOpacity>
                }
                <Button title={'Create Deal'} onPress={submit}/>
            </View>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
        },
        content:{
            flex: 1,
            padding: theme.wp('5%')
        },
        imagePicker:{
            width: '100%',
            height: theme.hp('30%'),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#8080809f',
            marginVertical: 20,
        },
        image:{
            width:'100%',
            height:'100%',
            resizeMode:'cover',
            borderStyle:'solid',
            borderColor: theme.colors.border,
            borderWidth:0.5,
        }
    });
