import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Button, Input, ProgressImage} from "../../components";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import {useFirebase, useFirestore} from "react-redux-firebase";
import uuid from 'react-native-uuid';
import Spinner from "react-native-loading-spinner-overlay";

const INITIAL_SATE = {
    title: null,
    image: null,
};

export const AddDealScreen = () => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();
    const [deal, setDeal] = useState(INITIAL_SATE);
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false);
    const submit = () => {
    
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
                setDeal({...deal, image: uri});
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid.v4() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/deals/${fileName}`)
                    .put(blob).on(
                    "state_changed",
                    (snapshot )=> {
                        setProgress(snapshot.bytesTransferred/snapshot.totalBytes);
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
                                setProgress(0);
                                setLoading(false);
                            })
                    }
                )
            }
        });
        
    }
    ;
    
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
                            <ProgressImage source={{uri: deal.image}}/>
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
        buttonStyle:{
            width: theme.wp('60%'),
            marginVertical: theme.hp('1%')
        },
        textStyle:{
            fontSize: 18,
        }
    });
