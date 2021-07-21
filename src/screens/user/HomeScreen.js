import React, {useState, useCallback, useEffect,} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Linking,
    SafeAreaView,
    FlatList,
    Image, StatusBar, TouchableOpacity,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Constants from 'expo-constants';
import {useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';
import moment from 'moment'
import {useFirebase, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {Button, Input, Paper, Overlay} from "../../components";
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from "react-native-paper";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as ImagePicker from "expo-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import ImageView from "react-native-image-view";
import { v4 as uuid } from 'uuid'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {imgIcon} from "../../commons/images";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import call from 'react-native-phone-call';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { ScrollView } from 'react-native';

const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
const latLng = `${33.18624068627443},${-94.86102794051021}`;
const label = 'Custom Label';

const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const OpenURLButton = ({url}) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);
    return <Button style={{padding: 2, marginBottom: 0,}} titleStyle={{fontFamily:'OpenSans'}} title={'Open Maps'} onPress={handlePress} />;
};

export const HomeScreen = () => {


    useFirestoreConnect([
        {collection:'settings', doc: 'gasPrice', storeAs: 'gasPrice'},
        {collection:'newArrivals', storeAs: 'newArrivals'},
        {collection:'onSales', storeAs: 'onSales'},
        {collection:'storeInfos', storeAs: 'storeInfos'},
        ]);

    const insets = useSafeAreaInsets();    

    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();

    const authUser = useSelector(state=>state.firebase.profile);
    const gasPrice = useSelector(state=>state.firestore.data.gasPrice || {});
    const newArrivals = useSelector(state=>state.firestore.ordered.newArrivals || []);
    const onSales = useSelector(state=>state.firestore.ordered.onSales || []);
    const storeInfos = useSelector(state=>state.firestore.ordered.storeInfos || []);

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleI, setVisibleI] = useState(false);
    const [visibleO, setVisibleO] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [newArrival, setNewArrival] = useState({title:'', image:''});
    const [onSale, setOnSale] = useState({title:'', image:''});
    const [storeInfo, setStoreInfo] = useState({image:''});
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(false);

    const [region] = useState({
        latitude: 33.18854068627443,
        longitude: -94.86152794051021,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const removeStoreInfo = (item) => {
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
                      firestore.collection('storeInfos')
                          .doc(item.id).delete().then(res=>{
                          console.log(res);
                      })
                  }
              }
          ]
        );
    }
   
   
    const removeNewArrival = (item) => {
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
                      firestore.collection('newArrivals')
                          .doc(item.id).delete().then(res=>{
                          console.log(res);
                      })
                  }
              }
          ]
        );
    }

    const removeOnSale = (item) => {
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
                      firestore.collection('onSales')
                          .doc(item.id).delete().then(res=>{
                          console.log(res);
                      })
                  }
              }
          ]
        );
    }

    const renderItemI = ({item}) => {

        if(item === 'add'){
            return (
                <TouchableOpacity style={styles.newArrivalAddItem} onPress={()=>{setVisibleI(true)}}>
                    <Feather name={'plus'} size={theme.wp('12%')}/>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity style={styles.storeInfoItem}>
                    {
                        authUser.role === 'admin' &&
                        <TouchableOpacity style={styles.newArrivalRemove} onPress={()=>{removeStoreInfo(item)}}>
                            <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                        </TouchableOpacity>
                    }
                    <Image source={{uri: item.image}} style={styles.storeInfoImage}/>
                </TouchableOpacity>
            )
        }
    }
    const renderItem = ({item}) => {

        if(item === 'add'){
            return (
                <TouchableOpacity style={styles.newArrivalAddItem} onPress={()=>{setVisible(true)}}>
                    <Feather name={'plus'} size={theme.wp('12%')}/>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity style={styles.newArrivalItem}>
                    {
                        authUser.role === 'admin' &&
                        <TouchableOpacity style={styles.newArrivalRemove} onPress={()=>{removeNewArrival(item)}}>
                            <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                        </TouchableOpacity>
                    }
                    <Image source={{uri: item.image}} style={styles.newArrivalImage}/>
                    <Text style={styles.newArrivalTitle}>{item.title}</Text>
                </TouchableOpacity>
            )
        }
    }

    const renderItemO = ({item}) => {

        if(item === 'add'){
            return (
                <TouchableOpacity style={styles.newArrivalAddItem} onPress={()=>{setVisibleO(true)}}>
                    <Feather name={'plus'} size={theme.wp('12%')}/>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity style={styles.newArrivalItem}>
                    {
                        authUser.role === 'admin' &&
                        <TouchableOpacity style={styles.newArrivalRemove} onPress={()=>{removeOnSale(item)}}>
                            <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                        </TouchableOpacity>
                    }
                    <Image source={{uri: item.image}} style={styles.newArrivalImage}/>
                    <Text style={styles.newArrivalTitle}>{item.title}</Text>
                </TouchableOpacity>
            )
        }
    }

    const submitI = () => {
        if(validate(storeInfo, {image:'required'})){
            firestore.collection('storeInfos')
                .add(storeInfo).then(res=>{
                    setStoreInfo({image: ''});
                    setVisibleI(false);
            })
        }
    }

    const submit = () => {
        if(validate(newArrival, {title:'required',image:'required'})){
            firestore.collection('newArrivals')
                .add(newArrival).then(res=>{
                    setNewArrival({title: '', image: ''});
                    setVisible(false);
            })
        }
    }

    const submitO = () => {
        if(validate(onSale, {title:'required',image:'required'})){
            firestore.collection('onSales')
                .add(onSale).then(res=>{
                    setOnSale({title: '', image: ''});
                    setVisibleO(false);
            })
        }
    }

    const handleClose = () => {
        setFullImage(false);
    }

    const openImagePickerAsyncI = async () => {
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/storeInfos/${fileName}`)
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
                            .ref("storeInfos/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                console.log(url)
                                setStoreInfo({...storeInfo, image: url})
                                setLoading(false);
                            })
                    }
                )
            }
        });

    };

    const openImagePickerAsync = async () => {
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/newArrivals/${fileName}`)
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
                            .ref("newArrivals/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                console.log(url)
                                setNewArrival({...newArrival, image: url})
                                setLoading(false);
                            })
                    }
                )
            }
        });

    };

    const openImagePickerAsyncO = async () => {
        ImagePicker.launchImageLibraryAsync().then(async (res)=>{
            if(!res.cancelled){
                const {uri} = res;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = uuid() + '.' + uri.split('.').pop();
                setLoading(true);
                firebase.storage().ref(`/onSales/${fileName}`)
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
                            .ref("onSales/")
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                console.log(url)
                                setOnSale({...onSale, image: url})
                                setLoading(false);
                            })
                    }
                )
            }
        });

    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(async (token) => {
            if(token && authUser.uid){
                const tokenRef = firestore.collection('tokens').doc(token);
                if (authUser.muteNotifications){
                    await tokenRef.delete();
                }else {
                    await tokenRef.set({ user: authUser.uid, token: token})
                }
            }
        });
    }, [authUser]);

    const resetMap = () =>{
        setRefresh(!refresh);
    }

    const phoneCall = () => {
        const args = {
            number: '9033805116',
            prompt: true,
        };
        call(args).catch(console.error);
    }

    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <View style={[styles.statusBar, {height: insets.top}]}/>
                <View style={styles.root}>

                    {/*  Store Info Overlay */}

                    <Overlay isVisible={visibleI} onBackdropPress={()=>{setVisibleI(false)}}>
                            <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
                            <View style={{width: theme.wp('70%')}}>
                                <TouchableOpacity style={[styles.newArrivalRemove,{top: -8, right: -8}]} onPress={()=>{setVisibleI(false)}}>
                                    <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                                </TouchableOpacity>
                                <View style={{flexDirection:'row', marginVertical: 10,}}>
                                    <Text>Image</Text>
                                    <TouchableOpacity
                                        style={{width: 20, height: 20, ...theme.styles.center, backgroundColor: theme.colors.success, marginLeft: 5, borderRadius: 10,}}
                                        onPress={openImagePickerAsyncI}
                                    >
                                        <Feather name={'plus'} size={16} color={'white'}/>
                                    </TouchableOpacity>
                                </View>
                                <Button title={'Submit'} onPress={submitI}/>
                            </View>
                         </Overlay>
                        
                        {/*  New Arrival Overlay */}
                        
                        <Overlay isVisible={visible} onBackdropPress={()=>{setVisible(false)}}>
                            <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
                            <View style={{width: theme.wp('70%')}}>
                                <TouchableOpacity style={[styles.newArrivalRemove,{top: -8, right: -8}]} onPress={()=>{setVisible(false)}}>
                                    <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                                </TouchableOpacity>
                                <Text>Title</Text>
                                <Input value={newArrival.title} style={styles.inputStyle} placeholder={'Title'} onChangeText={(name, value)=>{setNewArrival({...newArrival, title: value})}} />
                                <View style={{flexDirection:'row', marginVertical: 10,}}>
                                    <Text>Image</Text>
                                    <TouchableOpacity
                                        style={{width: 20, height: 20, ...theme.styles.center, backgroundColor: theme.colors.success, marginLeft: 5, borderRadius: 10,}}
                                        onPress={openImagePickerAsync}
                                    >
                                        <Feather name={'plus'} size={16} color={'white'}/>
                                    </TouchableOpacity>
                                </View>
                                <Button title={'Submit'} onPress={submit}/>
                            </View>
                         </Overlay>

                         {/* On Sale Overlay */}

                         <Overlay isVisible={visibleO} onBackdropPress={()=>{setVisibleO(false)}}>
                            <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
                            <View style={{width: theme.wp('70%')}}>
                                <TouchableOpacity style={[styles.newArrivalRemove,{top: -8, right: -8}]} onPress={()=>{setVisibleO(false)}}>
                                    <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                                </TouchableOpacity>
                                <Text>Title</Text>
                                <Input value={onSale.title} style={styles.inputStyle} placeholder={'Title'} onChangeText={(name, value)=>{setOnSale({...onSale, title: value})}} />
                                <View style={{flexDirection:'row', marginVertical: 10,}}>
                                    <Text>Image</Text>
                                    <TouchableOpacity
                                        style={{width: 20, height: 20, ...theme.styles.center, backgroundColor: theme.colors.success, marginLeft: 5, borderRadius: 10,}}
                                        onPress={openImagePickerAsyncO}
                                    >
                                        <Feather name={'plus'} size={16} color={'white'}/>
                                    </TouchableOpacity>
                                </View>
                                <Button title={'Submit'} onPress={submitO}/>
                            </View>
                         </Overlay>

                         {/* Top panel home bar */}

                         <View style={styles.topPanel}>
                            <View style={styles.topPanelContent}>
                                <View style={styles.mapArea}>
                                    <Image source={imgIcon} style={styles.logoStyle}/>
                                    {/* <Icon name="navigate" color={'gray'} size={theme.hp(' 4%')} /> */}
                                </View>
                                <View style ={styles.topTextArea}>
                                    <Text style={styles.topText}>Home</Text>
                                </View>
                                <View style ={styles.phoneArea}>
                                    <TouchableOpacity style={styles.phoneNumberWrapper} onPress={phoneCall}>
                                    <Icon name="call" color={theme.colors.main} size={theme.hp('4%')} />
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={styles.divider}></View> */}
                            </View>
                        </View>

            {/* New Arrival Section with ScrollView */}
                
                <ScrollView>

                    {/* Storeinfo flatlist */}

                    <FlatList
                        ListHeaderComponent = {() => (
                        <>
                                
                        </>
                        )}
                        horizontal
                        style={{width: '100%'}}
                        data={authUser.role === 'admin'?[...storeInfos,'add']: storeInfos}
                        renderItem={renderItemI}
                        showsVerticalScrollIndicator ={false}
                        keyExtractor={item => JSON.stringify(item)}
                    />


                    {/* New Arrival Flatlist */}

                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionText}> New Arrival</Text>
                    </View>

                    <FlatList
                        ListHeaderComponent = {() => (
                        <>
                                
                        </>
                        )}
                        horizontal
                        style={{width: '100%'}}
                        data={authUser.role === 'admin'?[...newArrivals,'add']: newArrivals}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator ={false}
                        keyExtractor={item => JSON.stringify(item)}
                    />

                    {/* OnSale Flatlist */}

                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionText}> On Sale/Clearance</Text>
                    </View>

                    <FlatList
                        ListHeaderComponent = {() => (
                        <>
                                
                        </>
                        )}
                        horizontal
                        style={{width: '100%'}}
                        data={authUser.role === 'admin'?[...onSales,'add']: onSales}
                        renderItem={renderItemO}
                        showsVerticalScrollIndicator ={false}
                        keyExtractor={item => JSON.stringify(item)}
                    />

                    <ImageView
                    images={images}
                    imageIndex={0}
                    isVisible={fullImage}
                    onClose={handleClose}
                    animationType={'none'}
                    />

                        {/* Rest of the Screen with info and logo */}

                            <View style={styles.mapContainer}>
                                <Paper onPress={resetMap} style={styles.getCurrentLocation}>
                                    <Feather name={'send'} size={theme.wp('4%')} />
                                </Paper>
                                <Paper style={styles.address}>
                                    {/* <Text style={styles.dealsText}>1738 TX-31, Mt Calm, TX 76673</Text> */}
                                    <OpenURLButton url={url} />
                                </Paper>
                                <MapView
                                    key={refresh}
                                    style={styles.mapFix}
                                    provider={PROVIDER_GOOGLE}
                                    region={region}
                                >
                                    <Marker coordinate={{latitude: 31.78534, longitude: -96.86084}} />
                                </MapView>
                                    <View style={styles.businessHours}>
                                        <Image source={imgIcon} style={styles.logoStyle}/>
                                        {/* <Text style={[styles.gasText,{marginBottom: theme.hp('1%')}]}>Hwy 31 Shop & Stop</Text> */}
                                        <Text style={[styles.gasText,{marginBottom: theme.hp('1%')}]}>Business Hours</Text>
                                        <Text style={styles.businessHourText}>Mon-Fri = 06:00 AM to 09:00 PM</Text>
                                        <Text style={styles.businessHourText}>Sat = 07:00 AM to 09:00 PM</Text>
                                        <Text style={styles.businessHourText}>Sun = 08:00 AM to 09:00 PM</Text>
                                        
                                    </View>
                            </View>

                            <View style={styles.gpCon}>
                                <Text style={styles.gasText}>Gas Price</Text>
                                <FontAwesome5 name="gas-pump" color="black" size={theme.hp('5%')} style={{marginVertical: 2}} />
                                <Text style={styles.dateText}>{moment().format('MM/DD/YYYY')}</Text>
                            </View>

                            <View style={styles.priceContainer}>
                                <View style={[styles.priceItem, {backgroundColor:'#e28e16'}]}>
                                    <Text style={styles.paragraph}>REGULAR</Text>
                                    <Text style={[styles.paragraph2,{color:'#e28e16'}]}>{gasPrice.regular || 0}/gal</Text>
                                </View>
                                <View style={[styles.priceItem, {backgroundColor:'#0b234b'}]}>
                                    <Text style={styles.paragraph}>PLUS</Text>
                                    <Text style={[styles.paragraph2, {color:'#0b234b'}]}>{gasPrice.plus || 0}/gal</Text>
                                </View>
                                <View style={[styles.priceItem, {backgroundColor:'#079e43'}]}>
                                    <Text style={styles.paragraph}>SUPER</Text>
                                    <Text style={[styles.paragraph2,{color:'#079e43'}]}>{gasPrice.super || 0}/gal</Text>
                                </View>
                                <View  style={[styles.priceItem, {backgroundColor:'#d10019'}]}>
                                    <Text style={styles.paragraph}>DIESEL</Text>
                                    <Text style={[styles.paragraph2,{color:'#d10019'}]}>{gasPrice.diesel || 0}/gal</Text>
                                </View>
                            </View>
                    </ScrollView>
                    
                </View>
            </SafeAreaView>
        </>
    );
}

const useStyles = theme => StyleSheet.create({
    root: {
        flex: 1,
        width:'100%',
        zIndex: 0,
        position:'relative',
        backgroundColor:'white',
    },
    statusBar:{
        position:'absolute',
        top: 0,
        width:'100%',
        backgroundColor:theme.colors.main,
    },
    topPanel: {
        position: 'relative',
        top: 0,
        left: 0,
        overflow: 'hidden',
        width: '100%',
        paddingBottom: 5, 
        zIndex: 4,  
    },
    topPanelContent: { 
        borderColor: theme.colors.main,
        borderBottomWidth: 10,
        borderBottomRightRadius: theme.wp('5%'),
        borderBottomLeftRadius: theme.wp('5%'),
        overflow:'hidden', 
        padding: '8%',
    },
    topTextArea: {
        position: 'absolute',
        left: theme.wp('40%'),
        top: theme.hp('2.7%'),
    },
    topText: {
        fontSize: theme.hp('3%'),
        fontWeight:'bold',
        color: 'black',
    },
    phoneArea: {
        position: 'absolute',
        right: theme.wp('8%'),
        top: theme.hp('1.7%'), 
    },
    mapArea: {
        position: 'absolute',
        left: theme.wp('8%'),
        top: theme.hp('1.0%'),
    },
    mapContainer:{
        width: theme.wp('100%'),
        height: theme.hp('25%'),
        position:'relative',
        marginTop: theme.hp('1%'),
        left: theme.wp('1%'),
        marginBottom: theme.hp('3%'),
    },
    mapFix: {
        width: theme.wp('40%'),
        height: '10%',
        position:'relative',
        flex: 1,
    },
    address:{
        opacity: 0.9,
        position:'absolute',
        left: theme.wp('3%'),
        top: theme.hp('18%'),
        flexDirection:'column',
        width: theme.wp('30%'),
    },
    getCurrentLocation:{
        width: theme.wp('8%'),
        height: theme.wp('8%'),
        position: 'absolute',
        top: theme.hp('1%'),
        left: theme.wp('30%'),
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.styles.shadow,
        zIndex: 2,
    },
    businessHours:{
        backgroundColor:'#fff',
        alignItems:'center',
        marginLeft: theme.wp('45%'),
        width: theme.wp('53%'),
        position:'absolute',  
    },
    businessHourText:{
        color: 'black',
        fontSize: theme.hp('1.8%')
    },
    gasText: {
        fontSize: theme.hp('2.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        paddingTop: 5,
    },
    sectionTitle: { 
        marginTop: theme.hp('2%'),
        height: theme.hp('5%'),
        zIndex: 2,
    },
    sectionText: {
        fontSize: theme.hp('2.5%'),
        fontWeight: 'bold',
    },
    logoStyle:{
        width: theme.wp('12%'),
        height: theme.wp('12%'),
        resizeMode: 'contain',
    },
    storeInfoImage: {
        width: theme.wp('100%'),
        height: theme.hp('40%'),
    },
    storeInfoItem: {
        position:'relative',
        width: theme.wp('90%'),
        height: theme.hp('40%'),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        marginVertical: 2.5,
        borderRadius: 10,
        overflow:'hidden',
        zIndex: 1,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#afafaf',
        marginHorizontal: theme.wp('2%'),
        marginTop: theme.wp('1.5%'),
        marginBottom: theme.wp('3.5%'),
    },
    newArrivalItem:{
        position:'relative',
        width: theme.wp('40%'),
        height: theme.hp('30%'),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        marginVertical: 2.5,
        borderRadius: 10,
        overflow:'hidden',
        zIndex: 1,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#afafaf',
        marginHorizontal: theme.wp('2%'),
        marginTop: theme.wp('1.5%'),
        marginBottom: theme.wp('1.5%'),
    },
    newArrivalRemove:{
        position:'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newArrivalTitle:{
        backgroundColor:'white',
        textAlign:'center',
        position:'absolute',
        fontWeight: 'bold',
        bottom: 0,
        padding: 5,
        width:'100%'
    },
    newArrivalAddItem:{
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
    newArrivalImage:{
        width: 200,
        height: 200,
      /* width: '100%',
      height: '100%',
      resizeMode:'cover', */
    },
    gpCon: {
        marginTop: theme.hp('4%'),
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: theme.hp('2%'),
        color: '#6e012a',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: theme.hp('1.5%'),
    },
    priceContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom: theme.hp('1.5%'),
    },
    priceItem:{
        width: '44%',
        margin:'1%',
        padding: 10,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius: theme.wp('1%')
    },
    paragraph: {
        fontSize: theme.hp('1.6%'),
        fontWeight: 'bold',
        textAlign: 'center',
        color:'white'
    },
    paragraph2: {
        fontSize: theme.hp('1.8%'),
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor:'white',
        paddingHorizontal: theme.wp('1.8%'),
        paddingVertical: theme.wp('1%'),
        borderRadius: 100,
    },
    
});


async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert(
                'Warning',
                'Please enable the permission to get push notification',
                [
                    {
                        style:'cancel',
                        text:'Cancel'
                    },
                    {
                        text:'Settings',
                        onPress:()=>{
                            Linking.openSettings();
                        }
                    }
                ]
            )
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
