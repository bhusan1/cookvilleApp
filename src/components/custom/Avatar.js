import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {imgAvatar} from "../../commons/images";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useFirebase, useFirestore} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImagePicker from 'expo-image-picker';

export const Avatar = ({size = 80, noEdit, style={}, disabled}) => {
    const firebase = useFirebase();
    const firestore = useFirestore();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const authUser = useSelector((state) => state.firebase.profile);
    
    const openImagePickerAsync = async () => {
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = authUser.uid + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/avatars/${fileName}`)
                    .put(blob).on(
                    "state_changed",
                    (snapshot )=> {
                        const progress = Math.floor(snapshot.bytesTransferred/snapshot.totalBytes * 100);
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                    },
                    ()=>{
                        firebase.storage()
                            .ref("avatars/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                firestore.collection('users').doc(authUser.uid)
                                    .update({photoUrl: url})
                                    .then(()=>{
                                        setLoading(false);
                                        setProgress(0);
                                    })
                            })
                    }
                )
            }
        });
        
    };
    
    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'white',
        borderStyle:'solid',
        borderWidth: 0.5,
        borderColor: '#8080807f',
        ...style,
    };

    const uploadButtonStyle = {
        width: 28,
        height: 28,
        borderRadius: 14,
        position: 'absolute',
        top: 12,
        right: -8,
        zIndex: 2,
        backgroundColor: '#aeaeae',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const avatarStyle = {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        position: 'relative',
        zIndex: 1,
        borderRadius: 2000,
    };

    return (
        <View style={containerStyle}>
            <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
            {!noEdit && (
                <TouchableOpacity style={uploadButtonStyle} onPress={openImagePickerAsync}>
                    <AntDesign name={'camera'} size={16} color={'white'} />
                </TouchableOpacity>
            )}
            <Image style={avatarStyle} source={authUser.photoUrl?{uri: authUser.photoUrl}:imgAvatar} />
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
        },
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: '#fff',
            alignItems: 'center',
        },
        titleText: {
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 20,
        },
        textStyle: {
            padding: 10,
            color: 'black',
            textAlign: 'center',
        },
        buttonStyle: {
            alignItems: 'center',
            backgroundColor: '#DDDDDD',
            padding: 5,
            marginVertical: 10,
            width: 250,
        },
        imageStyle: {
            width: 200,
            height: 200,
            margin: 5,
        },
    });
