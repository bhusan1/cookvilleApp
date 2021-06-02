import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text, Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Button, Input } from "../../components";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import {useFirebase, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import { v4 as uuid } from 'uuid'
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import {showMessage} from 'react-native-flash-message';
import {useSelector} from "react-redux";

const INITIAL_SATE = {
    title: '',
    image: '',
    price:'',
};

export const AddRecipeScreen = ({route, navigation}) => {

    const deli = route.params?.deli;

    useFirestoreConnect([{collection:'tokens'}]);

    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();

    const tokens = useSelector(state=>state.firestore.ordered.tokens || []);
    const authUser = useSelector(state=>state.firebase.profile);

    const [deal, setDeal] = useState(deli || INITIAL_SATE);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const submit = () => {
        if(validate(deal,{title:'required', image: 'required', price:'required'})){
            setLoading(true);
            setLoadingText('Loading');
            if(deal.id){
                firestore.collection('recipes').doc(deal.id).update({
                    title: deal.title,
                    price: deal.price,
                }).then(async ()=>{
                    await sendPushNotification();
                    showMessage({
                        message: 'Success',
                        description: 'Recipe updated successfully!',
                        type: 'success',
                    });
                    setLoading(false);
                })
            }else {
                firestore.collection('recipes').add(deal).then(async ()=>{
                    await sendPushNotification();
                    showMessage({
                        message: 'Success',
                        description: 'Recipe created successfully!',
                        type: 'success',
                    });
                    setLoading(false);
                })
            }
        }
    }

    const deleteRecipe = () => {
        Alert.alert('Confirm Delete','Are you really want to delete this deli?',
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Delete',
                    onPress:()=>{
                        firestore.collection('recipes').doc(deal.id).delete()
                            .then(res=>{
                                navigation.goBack();
                            })
                    }
                }
            ])
    }

    const openImagePickerAsync = async () => {

        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/recipes/${fileName}`)
                    .put(blob).on(
                    "state_changed",
                    (snapshot )=> {
                        const progress = Math.floor(snapshot.bytesTransferred/snapshot.totalBytes * 100);
                        setLoadingText(`Uploading (${progress}%)`);
                    },
                    (error) => {
                        console.log(error);
                    },
                    ()=>{
                        firebase.storage()
                            .ref("recipes/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                setDeal({...deal, image: url});
                                setLoading(false);
                            })
                    }
                )
            }
        });
    };

    const sendPushNotification = async () => {
        const pushTokens = tokens.reduce((result, item)=>{
            if(authUser.uid !== item.user){
                result.push(item.token)
            }
            return result;
        },[])
        const message = {
            to: pushTokens,
            sound: 'default',
            title: 'Recipe Created',
            body: 'Recipe ' + deal.title + ' added!',
            _displayInForeground: true,
        };

        return  await fetch('https://exp.host/--/api/v2/push/send', {
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
            <Spinner visible={loading} textContent={loadingText} textStyle={{color: 'white'}} />
            <View style={styles.content}>
                <Input
                    name={'title'}
                    value={deal.title}
                    onChangeText={(name, value)=>setDeal({...deal, [name]: value})}
                    placeholder={'Title'}
                />
                <Input
                    name={'price'}
                    value={deal.price}
                    onChangeText={(name, value)=>setDeal({...deal, [name]: value})}
                    placeholder={'Price'}
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
                <Button title={deal.id?'Update Recipe':'Create Recipe'} onPress={submit}/>

                {
                    deal.id &&
                    <TouchableOpacity style={{marginTop: 20}} onPress={deleteRecipe}>
                        <Text style={{color:'red', textAlign:'center', fontSize: 18, fontWeight:'bold'}}>Delete Recipe</Text>
                    </TouchableOpacity>
                }
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
            borderWidth:0.5,
        }
    });
