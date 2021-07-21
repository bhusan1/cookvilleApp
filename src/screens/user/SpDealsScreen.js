import React, {useState} from 'react';
import {
    FlatList,
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    Alert,
    TouchableOpacity
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFirebase, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {Button, Input, Overlay} from "../../components";
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from "react-native-paper";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as ImagePicker from "expo-image-picker";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import ImageView from "react-native-image-view";
import { v4 as uuid } from 'uuid'


export const SpDealsScreen = ({navigation}) => {

    useFirestoreConnect([
        {collection:'homeDeals', storeAs: 'homeDeals'}
        ]);


    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();

    const authUser = useSelector(state=>state.firebase.profile);
    const homeDeals = useSelector(state=>state.firestore.ordered.homeDeals || []);

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [homeDeal, setHomeDeal] = useState({title:'', image:''});
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(false);



   /*  const viewFullImage = () => {
        const homeDealImages = homeDeals.reduce((result, item)=>{
            result.push({
                source: {uri: item.image,},
                title: item.title,
                width: theme.wp('100%'),
                height: theme.hp('100%'),
            })
            return result;
        }, [])
        if(homeDealImages.length > 0){
            setImages(homeDealImages);
            setFullImage(true)
        }
    } */

    const removeHomeDeal = (item) => {
        Alert.alert(
          'Confirm',
          'Do you really want to remove it?',
          [
              {
                  text:'Cancel',
                  style:'cancel'
              },
              {
                  text: 'Delete',
                  onPress:()=>{
                      console.log(item)
                      firestore.collection('homeDeals')
                          .doc(item.id).delete().then(res=>{
                          console.log(res);
                      })
                  }
              }
          ]
        );
    }

    const renderItem = ({item}) => {

        if(item === 'add'){
            return (
                <TouchableOpacity style={styles.homeDealAddItem} onPress={()=>{setVisible(true)}}>
                    <Feather name={'plus'} size={theme.wp('12%')}/>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity style={styles.homeDealItem}>
                    {
                        authUser.role === 'admin' &&
                        <TouchableOpacity style={styles.homeDealRemove} onPress={()=>{removeHomeDeal(item)}}>
                            <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                        </TouchableOpacity>
                    }
                    <Image source={{uri: item.image}} style={styles.homeDealImage}/>
                    <Text style={styles.homeDealTitle}>{item.title}</Text>
                </TouchableOpacity>
            )
        }
    }

    const submit = () => {
        if(validate(homeDeal, {title:'required',image:'required'})){
            firestore.collection('homeDeals')
                .add(homeDeal).then(res=>{
                    setHomeDeal({title: '', image: ''});
                    setVisible(false);
            })
        }
    }

    const handleClose = () => {
        setFullImage(false);
    }

    const openImagePickerAsync = async () => {
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/homeDeals/${fileName}`)
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
                            .ref("homeDeals/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                console.log(url)
                                setHomeDeal({...homeDeal, image: url})
                                setLoading(false);
                            })
                    }
                )
            }
        });

    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={[styles.statusBar, {height: insets.top}]}/>
            <Overlay isVisible={visible} onBackdropPress={()=>{setVisible(false)}}>
                <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
                <View style={{width: theme.wp('70%')}}>
                    <TouchableOpacity style={[styles.homeDealRemove,{top: -8, right: -8}]} onPress={()=>{setVisible(false)}}>
                        <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                    </TouchableOpacity>
                    <Text>Title</Text>
                    <Input value={homeDeal.title} style={styles.inputStyle} placeholder={'Title'} onChangeText={(name, value)=>{setHomeDeal({...homeDeal, title: value})}} />
                    <View style={{flexDirection:'row', marginVertical: 10,}}>
                        <Text>Image</Text>
                        <TouchableOpacity
                            style={{width: 20, height: 20, ...theme.styles.center, backgroundColor: theme.colors.success, marginLeft: 5, borderRadius: 10,}}
                            onPress={openImagePickerAsync}
                        >
                            <Feather name={'plus'} size={16} color={'white'}/>
                        </TouchableOpacity>
                    </View>
                    <Button title={'submit'} onPress={submit}/>
                </View>
            </Overlay>
            <View style={styles.header}>
                <Text style={styles.headText}>Monthly Special</Text>
            </View>
            <FlatList
                    style={{flex: 1, width:'100%'}}
                    data={authUser.role === 'admin'?[...homeDeals,'add']: homeDeals}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => JSON.stringify(item)}
                />
            <ImageView
                    images={images}
                    imageIndex={0}
                    isVisible={fullImage}
                    onClose={handleClose}
                    animationType={'none'}
            />
        </SafeAreaView>
    );
};


const useStyles = theme => StyleSheet.create({
    root: {
        flex: 1,
        width:'100%',
        zIndex: 0,
        position:'absolute'
    },
    statusBar:{
        position:'absolute',
        top: 0,
        width:'100%',
        backgroundColor:theme.colors.main,
    },
    inputStyle:{
        height: 30,
    },
    headText: {
        fontSize: theme.hp('2.8%'),
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color:'black',
    },
    header:{
        width:'100%',
        height: theme.hp('10%'),
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        borderColor: theme.colors.main,
        borderWidth: 10,
        borderBottomRightRadius: theme.wp('5%'),
        borderBottomLeftRadius: theme.wp('5%'),
    },
    homeDealItem:{
        position:'relative',
        height: theme.hp('30%'),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        marginVertical: 2.5,
        borderRadius: 10,
        overflow:'hidden',
        zIndex: 2,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#afafaf',
        marginHorizontal: theme.wp('2%'),
        marginTop: theme.wp('1.5%'),
    },
    homeDealRemove:{
        position:'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeDealTitle:{
        backgroundColor:'white',
        textAlign:'center',
        position:'absolute',
        bottom: 0,
        padding: 5,
        width:'100%'
    },
    homeDealAddItem:{
        position:'relative',
        height: 50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderRadius: 15,
        marginVertical: 5,
        overflow:'hidden',
        ...theme.styles.shadow,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#afafaf',
        zIndex: 2,
    },
    homeDealImage:{
      width: '100%',
      height: '100%',
      resizeMode:'cover',
    },
    container: {
        justifyContent: 'center',
    },
    divider: {
        padding: theme.hp('1%'),
        backgroundColor: 'white',
    },
    dealsText: {
        fontSize: theme.hp('1.5%'),
        color: '#bc245c',
        fontWeight: 'bold',
        textAlign:'center',
    },
    priceItem:{
        width: '44%',
        margin:'1%',
        padding: 10,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius: theme.wp('1%')
    }
});
