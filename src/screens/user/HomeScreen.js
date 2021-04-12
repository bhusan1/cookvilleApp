import React, {useState, useCallback, useEffect,} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Linking,
    SafeAreaView,
    FlatList,
    Image, TouchableOpacity, StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Constants from 'expo-constants';
import {useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';
import moment from 'moment'
import {useFirebase, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {Button, Input, Paper} from "../../components";
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from "react-native-paper";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Overlay} from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Spinner from "react-native-loading-spinner-overlay";
import {validate} from "../../commons/helper";
import ImageView from "react-native-image-view";
import { v4 as uuid } from 'uuid'
import {imgIcon} from "../../commons/images";
import MarqueeText from "react-native-marquee";

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
        {collection:'homeDeals', storeAs: 'homeDeals'}
        ]);

    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();

    const authUser = useSelector(state=>state.firebase.profile);
    const gasPrice = useSelector(state=>state.firestore.data.gasPrice || {});
    const homeDeals = useSelector(state=>state.firestore.ordered.homeDeals || []);

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [homeDeal, setHomeDeal] = useState({title:'', image:''});
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(false);

    const [region] = useState({
        latitude: 33.18854068627443,
        longitude: -94.86152794051021,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {
        registerForPushNotificationsAsync().then(async (token) => {
            if(token){
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

    const viewFullImage = () => {
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
    }

    const removeHomeDeal = (item) => {
        Alert.alert(
          'Confirm',
          'Are you really want to remove it?',
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
                <TouchableOpacity style={styles.homeDealItem} onPress={viewFullImage}>
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
        <>
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'}/>
                <View style={styles.root}>
                    <Overlay isVisible={visible} onBackdropPress={()=>{setVisible(false)}}>
                        <Spinner visible={loading} textContent={`Uploading (${progress}%)`} textStyle={{color: 'white'}} />
                        <View style={{width: theme.wp('70%')}}>
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
                    <View style={styles.topPanel}>
                        <View style={styles.topPanelContent}>
                            <View style={styles.saCon}>
                                <Image source={imgIcon} style={styles.logoStyle}/>
                                <Text style={styles.gasText}>Cookville #1 Stop</Text>
                            </View>
                            <View style={styles.divider}>
                                <MarqueeText
                                    style={{fontSize: theme.hp('2%'), color: '#bc245c', paddingBottom: theme.hp('1%'), textAlign:'center'}}
                                    duration={3000}
                                    marqueeOnStart
                                    loop={true}
                                    marqueeDelay={1000}
                                    marqueeResetDelay={500}
                                >
                                    Find Deals on In-store Purchase and Deli and Save on Gas
                                </MarqueeText>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        ListHeaderComponent = {()=>(
                            <>
                                <View style={styles.mapContainer}>
                                    <Paper onPress={resetMap} style={styles.getCurrentLocation}>
                                        <Feather name={'send'} size={theme.wp('4%')} />
                                    </Paper>
                                    <Paper style={styles.address}>
                                        <Text style={styles.dealsText}>6262 US HWY 67 E Cookville, TX 75558</Text>
                                        <OpenURLButton url={url} />
                                    </Paper>
                                    <MapView
                                        key={refresh}
                                        style={styles.mapFix}
                                        provider={PROVIDER_GOOGLE}
                                        region={region}
                                    >
                                        <Marker coordinate={{latitude: 33.18624068627443, longitude: -94.86102794051021}} />
                                    </MapView>
                                </View>
                                <View style={styles.businessHours}>
                                    <Text style={[styles.gasText,{marginBottom: theme.hp('1%')}]}>Business Hours</Text>
                                    <Text style={styles.businessHourText}>Mon-Fri = 06:00 AM to 09:00 PM</Text>
                                    <Text style={styles.businessHourText}>Sat = 07:00 AM to 09:00 PM</Text>
                                    <Text style={styles.businessHourText}>Sun = 08:00 AM to 09:00 PM</Text>
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
                            </>
                        )}
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
        position:'relative'
    },
    inputStyle:{
        height: 30,
    },
    businessHours:{
      backgroundColor:'#87ceeb',
        paddingVertical: theme.hp('2%'),
        alignItems:'center',
    },
    businessHourText:{
        color: 'black',
        fontSize: theme.hp('2%')
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
    topPanel: {
        position:'absolute',
        top: 0,
        left: 0,
        width:'100%',
        paddingBottom: 5,
        overflow: 'hidden',
        zIndex: 3,
    },
    logoStyle:{
        width: theme.wp('15%'),
        height: theme.wp('15%'),
        resizeMode: 'contain',
    },
    topPanelContent:{
        ...theme.styles.shadow,
        borderBottomRightRadius: theme.wp('5%'),
        borderBottomLeftRadius: theme.wp('5%'),
        overflow:'hidden',
    },

    footerPanel:{
        position:'absolute',
        bottom: 0,
        width: '100%',
        ...theme.styles.shadow,
        height: theme.hp('45%'),
        backgroundColor:'white',
    },
    mapContainer:{
        width: theme.wp('100%'),
        height: theme.hp('45%'),
        position:'relative',
        flex: 1,
        marginTop: theme.hp('5%'),
    },
    mapFix: {
        width: theme.wp('100%'),
        height: '100%',
        position:'relative',
        flex: 1,
    },
    address:{
        opacity: 0.9,
        position:'absolute',
        left: theme.wp('5%'),
        top: theme.hp('16%'),
        flexDirection:'column',
        width: theme.wp('35%'),
    },
    getCurrentLocation:{
        width: theme.wp('8%'),
        height: theme.wp('8%'),
        position: 'absolute',
        top: theme.hp('16%'),
        right: theme.wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.styles.shadow,
        zIndex: 2,
    },
    divider: {
        padding: theme.hp('1%'),
        backgroundColor: 'white',
    },
    gasText: {
        fontSize: theme.hp('2.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#bc245c',
        paddingTop: 5,
    },
    dealsText: {
        fontSize: theme.hp('1.5%'),
        color: '#bc245c',
        fontWeight: 'bold',
        textAlign:'center',
    },
    dateText: {
        fontSize: theme.hp('2%'),
        color: '#6e012a',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: theme.hp('1.5%'),
    },
    gasPrice: {
        width: 250,
        height: 50,
    },
    saCon: {
        paddingTop: theme.hp('1%'),
        backgroundColor: 'white',
        alignItems: 'center',
    },
    gpCon: {
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priceContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom: theme.hp('1.5%'),
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
            alert('Failed to get push token for push notification!');
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
