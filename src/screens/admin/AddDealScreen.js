import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text, Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Button, Input } from "../../components";
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import {useFirebase, useFirestore} from "react-redux-firebase";
import uuid from 'react-native-uuid';
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import {showMessage} from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";

const INITIAL_SATE = {
    title: '',
    description:'',
    deadline: moment().format('MM/DD/YYYY'),
    barcode: '',
};

export const AddDealScreen = (props) => {
    
    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();
    const [deal, setDeal] = useState(props.route.params?.deal || INITIAL_SATE);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    
    const submit = () => {
        if(validate(deal,{title:'required',description:'required', barcode: 'required'})){
            setLoading(true);
            setLoadingText('Loading');
            firestore.collection('deals').add(deal).then(async (res)=>{
                showMessage({
                    message: 'Success',
                    description: 'Deal created successfully!',
                    type: 'success',
                });
                setDeal({...deal, id: res.id})
                setLoading(false);
            })
        }
    }
    
    const update = () => {
        if(validate(deal,{title:'required',description:'required', barcode: 'required'})){
            setLoading(true);
            setLoadingText('Loading');
            firestore.collection('deals').doc(deal.id).update(deal).then(async ()=>{
                showMessage({
                    message: 'Success',
                    description: 'Deal updated successfully!',
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
                firebase.storage().ref(`/barcodes/${fileName}`)
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
                            .ref("barcodes/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                setDeal({...deal, barcode: url});
                                setLoading(false);
                            })
                    }
                )
            }
        });
        
    };
    
    const handleChange = (name, value)=>setDeal({...deal, [name]: value})
    
    const deleteDeal = () => {
        Alert.alert(
            'Confirm',
            'Are you really want to delete this deal?',
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },{
                text:'Delete',
                onPress:()=>{
                    firestore.collection('deals').doc(deal.id).delete().then(()=>{
                        showMessage({
                            message: 'Success',
                            description: 'Deal deleted successfully!',
                            type: 'success',
                        });
                        props.navigation.goBack();
                    })
                }
            }])
    }
    
    return (
        <View style={styles.root} >
            <Spinner visible={loading} textContent={loadingText} textStyle={{color: 'white'}} />
            <View style={styles.content}>
                <Text>Title</Text>
                <Input
                    name={'title'}
                    value={deal.title}
                    onChangeText={handleChange}
                    placeholder={'Title'}
                />
                <Text>Description</Text>
                <Input
                    name={'description'}
                    value={deal.description}
                    onChangeText={handleChange}
                    placeholder={'Description'}
                />
                <Text>Deadline</Text>
                <DatePicker
                    showIcon={true}
                    androidMode="spinner"
                    style={styles.datePicker}
                    date={deal.deadline}
                    mode="date"
                    placeholder="MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateInput: {
                            backgroundColor: 'white',
                            borderWidth: 0.5,
                            borderRadius: 5,
                        },
                    }}
                    onDateChange={(date) => {
                        handleChange('deadline', date);
                    }}
                />
                {
                    deal.barcode?
                        <View style={styles.imagePicker}>
                            <Image style={styles.image} source={{uri: deal.barcode}}/>
                        </View>:
                        <TouchableOpacity style={styles.imagePicker} onPress={openImagePickerAsync}>
                            <MaterialCommunityIcons name={'barcode'} size={theme.wp('20%')} color={'black'} />
                        </TouchableOpacity>
                }
                {
                    deal.id ?
                        <Button title={'Update Deal'} onPress={update}/>:
                        <Button title={'Create Deal'} onPress={submit}/>
                }
                {
                    deal.id &&
                    <Text style={theme.styles.dangerText} onPress={deleteDeal}>Delete Deal</Text>
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
            height: theme.hp('10%'),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'lightgray',
            marginVertical: 30,
            borderWidth: 0.5
        },
        image:{
            width:'100%',
            height:'100%',
            resizeMode:'cover',
            borderWidth:0.5,
        },
        datePicker:{
            width:'100%',
            height: 40,
        }
    });
