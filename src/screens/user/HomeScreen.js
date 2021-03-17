import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Alert, Linking, ScrollView, SafeAreaView, StatusBar} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Card} from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import {useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';
import moment from 'moment'
import {useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {Button, Paper} from "../../components";
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from "react-native-paper";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

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

const OpenURLButton = ({url, children}) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);
    return <Button title={children} onPress={handlePress} />;
};

export const HomeScreen = () => {
    
    useFirestoreConnect([{collection:'settings', doc: 'gasPrice', storeAs: 'gasPrice'}])
    
    const theme = useTheme();
    const styles = useStyles(theme);
    
    const firestore = useFirestore();
    const authUser = useSelector(state=>state.firebase.profile);
    const gasPrice = useSelector(state=>state.firestore.data.gasPrice || {});
    
    const [refresh, setRefresh] = useState(false);
    const [region] = useState({
        latitude: 33.18624068627443,
        longitude: -94.86102794051021,
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
                    await tokenRef.set({ user: authUser.uid, token})
                }
            }
        });
    }, [authUser]);

    const resetMap = () =>{
        setRefresh(!refresh);
    }
    
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView>
                <View style={styles.saCon}>
                    <Text style={styles.gasText}>Store Address {'\n'} Cookville #1 Stop</Text>
                    <Text style={styles.dealsText}> 6262 US HWY 67 E Cookville, TX 75558 </Text>
                    <OpenURLButton url={url}>Open Maps</OpenURLButton>
                </View>
                <View style={styles.mapFix}>
                    <Paper onPress={resetMap} style={styles.getCurrentLocation}>
                        <Feather name={'send'} size={20} />
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
                <View style={styles.divider}>
                    <MarqueeText
                        style={{fontSize: 24, color: '#bc245c'}}
                        duration={6000}
                        marqueeOnStart
                        loop={true}
                        marqueeDelay={1000}
                        marqueeResetDelay={500}>
                        Find Deals on In-store Purchase and Deli and Save on Gas
                    </MarqueeText>
                </View>
                <View style={styles.gpCon}>
                    <Text style={styles.gasText}>Gas Price</Text>
                    <FontAwesome5 name="gas-pump" color="black" size={70} style={{marginVertical: 10}} />
                    <Text style={styles.dateText}>{moment().format('MM/DD/YYYY')}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <View style={styles.col1}>
                        <Card size="15" title="Regular">
                            <Text style={styles.paragraph}>REGULAR {'\n'} {gasPrice.regular || 0}/gal</Text>
                        </Card>
                        <Card size="12" title="Plus">
                            <Text style={styles.paragraph}>PLUS {'\n'} {gasPrice.plus || 0}/gal</Text>
                        </Card>
                    </View>

                    <View style={styles.col1}>
                        <Card title="Super">
                            <Text style={styles.paragraph}>SUPER {'\n'} {gasPrice.super || 0}/gal</Text>
                        </Card>
                        <Card title="Diesel">
                            <Text style={styles.paragraph}>DIESEL {'\n'}{gasPrice.diesel || 0}/gal</Text>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const useStyles = theme => StyleSheet.create({
    root: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    container: {
        justifyContent: 'center',
    },
    topImg: {
        paddingTop: 20,
        width: 300,
        height: 200,
    },
    mapFix: {
        width: 400,
        height: 300,
        position:'relative',
        flex: 1,
    },
    getCurrentLocation:{
        width: 40,
        height: 40,
        position: 'absolute',
        top: theme.hp('2%'),
        right: theme.wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.styles.shadow,
        zIndex: 2,
    },
    divider: {
        padding: 20,
        backgroundColor: 'white',
    },
    gasText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#bc245c',
        paddingTop: 20,
    },
    dealsText: {
        fontSize: 15,
        color: '#bc245c',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    dateText: {
        fontSize: 15,
        color: '#6e012a',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
    gasPrice: {
        width: 250,
        height: 50,
    },
    saCon: {
        padding: 20,
        backgroundColor: '#fff',
    },
    gpCon: {
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priceContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#bc245c',
    },

    col1: {
        flexDirection: 'row',
        height: 100,
        alignItems: 'center',
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16,
    },
    entityText: {
        fontSize: 20,
        color: '#333333',
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
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
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
