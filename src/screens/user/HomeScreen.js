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
import {Button, Input, Paper} from "../../components";
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from "react-native-paper";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {imgIcon} from "../../commons/images";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import call from 'react-native-phone-call';

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
        /* {collection:'homeDeals', storeAs: 'homeDeals'} */
        ]);

    const theme = useTheme();
    const styles = useStyles(theme);
    const firebase = useFirebase();
    const firestore = useFirestore();

    const authUser = useSelector(state=>state.firebase.profile);
    const gasPrice = useSelector(state=>state.firestore.data.gasPrice || {});
    /* const homeDeals = useSelector(state=>state.firestore.ordered.homeDeals || []); */

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    /* const [homeDeal, setHomeDeal] = useState({title:'', image:''});
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(false); */

    const [region] = useState({
        latitude: 33.18854068627443,
        longitude: -94.86152794051021,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

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
                <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'}/>
                <View style={styles.root}>
                    <View style={styles.topPanel}>
                        <View style={styles.topPanelContent}>
                            <View style={styles.saCon}>
                                <Image source={imgIcon} style={styles.logoStyle}/>
                                <Text style={styles.gasText}>Cookville #1 Stop</Text>
                            </View>
                            <View style={styles.divider}></View>
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
                                <View style={styles.phoneArea}>
                                    <TouchableOpacity style={styles.phoneNumberWrapper} onPress={phoneCall}>
                                        <FontAwesome name={'phone'} size={20} color={theme.colors.secondary} />
                                        <Text style={styles.phoneNumber}>903-380-5116</Text>
                                    </TouchableOpacity>
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
                        /*data={authUser.role === 'admin'?[...homeDeals,'add']: homeDeals}*/
                       /* renderItem={renderItem}*/
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => JSON.stringify(item)}
                    />
                    {/* <ImageView
                        images={images}
                        imageIndex={0}
                        isVisible={fullImage}
                        onClose={handleClose}
                        animationType={'none'}
                    /> */}
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
    inputStyle:{
        height: 30,
    },
    phoneArea:{
        backgroundColor:'white',
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: theme.wp('6%')
    },
    phoneNumberWrapper:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
    },
    phoneNumber:{
        fontSize: theme.hp('2%'),
        fontWeight:'bold',
        color: theme.colors.secondary,
        paddingLeft: theme.wp('3%')
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
        marginTop: theme.hp('7%'),
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
            Alert.alert(
                'Warning',
                'Please enable the permission to get push notification',
                [
                    {
                        style:'cancel',
                        text:'Cancel'
                    },
                    {
                        text:'Setting',
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
