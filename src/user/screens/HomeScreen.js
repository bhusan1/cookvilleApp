import React, { useState, useCallback} from 'react';
import { View, Text, StyleSheet, Image, Linking,Button, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';

import Icon from 'react-native-vector-icons/Ionicons';

/* import { firestore } from "@react-native-firebase/firestore"; */

const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
const latLng = `${33.18624068627443},${-94.86102794051021}`;
const label = 'Custom Label';
const url = Platform.select({
  ios: `${scheme}${label}@${latLng}`,
  android: `${scheme}${latLng}(${label})`
});

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};


const HomeScreen = ({navigation}) => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    const [region, setRegion] = useState({
        latitude: 33.18624068627443,
        longitude: -94.86102794051021,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    /* firestore().collection('gasPrice') */
        
    return(
      <ScrollView>
      {/* <View style={styles.topImg}>
      <Image source={require('../../../assets/nozzle.png')} style={{ width: 300, height: 200 }}/>
      </View> */}
      <View style={styles.saCon}>
        <Text style={styles.gasText}>Store Address {"\n"} Cookville #1 Stop</Text>
        
        <Text style={styles.dealsText}>  6262 US HWY 67 E Cookville, TX 75558 </Text>
        <OpenURLButton url={url}>Open Maps</OpenURLButton>
      </View>
      
      <MapView
      style={styles.mapFix}
      region={region}
      showsUserLocation={true}
      onRegionChangeComplete={region => setRegion(region)}>
      <Marker coordinate={{ latitude: 33.18624068627443, longitude: -94.86102794051021 }} />
    </MapView>
      
    <View style={styles.divider}>
    <MarqueeText 
         style={{ fontSize: 24, color: '#bc245c' }}
          duration={6000}
          marqueeOnStart
          loop={true}
          marqueeDelay={1000}
          marqueeResetDelay={500}
    >
    Find Deals on In-store Purchase and Deli and Save on Gas
    </MarqueeText>

    
    {/* <Text style={styles.dealsText}>Find Deals on{"\n"}In-store Purchase{"\n"}Deli Food{"\n"}And SAVE on Gas{"\n"}with Fuel Rewards Deals</Text> */}
        
      </View>

      <View style={styles.gpCon}>
        <Text style={styles.gasText}>Gas Price</Text>
        <Icon name="color-fill" color='red' size={36} />
        <Text style={styles.dateText}>{month}-{date}-{year}</Text>
      </View>
        
        <View style={styles.priceContainer}>
            <View style={styles.col1}>
                <Card size="15" title="Regular" >
                <Text style={styles.paragraph}>
                        REGULAR {"\n"} 2.259/gal
                </Text>
                </Card>
                <Card size="12" title="Plus">
                <Text style={styles.paragraph}>
                        PLUS {"\n"} 2.4979/gal
                </Text>
                </Card>
            </View>

            <View style={styles.col1}>
                <Card title="Super">
                <Text style={styles.paragraph}>
                        SUPER {"\n"} 2.7983/gal
                </Text>
                </Card>
                <Card title="Diesel">
                <Text style={styles.paragraph}>
                        DIESEL {"\n"}2.4991/gal
                </Text>
                </Card>
            </View>  
        </View>
      
    </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center'
  },
  topImg: {
    paddingTop:20,
    width: 300,
    height: 200,

  },
  mapFix:{
    width: 400,
    height: 300
  },
  divider:{
    padding: 20,
    backgroundColor: 'white'
  },
  gasText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color:'#bc245c',
    paddingTop: 20
  },
  dealsText: {
    fontSize: 15,
    color: '#bc245c',
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom:20
  },
  dateText: {
    fontSize: 15,
    color: '#6e012a',
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom:20
  },
  gasPrice: {
    width: 250,
    height: 50, 
  },
  saCon: {
    padding: 20,
    backgroundColor: '#fff'
  },
  gpCon: {
    alignItems:'center',
    backgroundColor: '#fff'
  },
  priceContainer: {
    backgroundColor: '#fff',
    alignItems:'center'
      
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#bc245c',
  },

  col1:{
    flexDirection: 'row',
    height: 100,
    alignItems: 'center'
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
    alignItems: 'center'
},
input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5
},
button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: "center",
    justifyContent: 'center'
},
buttonText: {
    color: 'white',
    fontSize: 16
},
listContainer: {
    marginTop: 20,
    padding: 20,
},
entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16
},
entityText: {
    fontSize: 20,
    color: '#333333'
},

});
