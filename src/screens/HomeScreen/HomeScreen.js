import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';

/* import { firestore } from "@react-native-firebase/firestore"; */


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
      <View style={styles.saCon}>
        <Text style={styles.gasText}>Store Address {"\n"} Cookville #1 Stop</Text>
        <Text style={styles.dealsText}>  6262 US HWY 67 E Cookville, TX 75558 </Text>
      </View>
      
      <MapView
      style={styles.mapFix}
      region={region}
      showsUserLocation={true}
      onRegionChangeComplete={region => setRegion(region)}>
      <Marker coordinate={{ latitude: 33.18624068627443, longitude: -94.86102794051021 }} />
    </MapView>

      <View style={styles.gpCon}>
        <Text style={styles.gasText}>Gas Price</Text>
        <Icon name="color-fill" color='red' size={36} />
        <Text style={styles.dateText}>{month}-{date}-{year}</Text>
      </View>
        
        <View style={styles.priceContainer}>
            <View style={styles.col1}>
                <Card size="15" title="Regular" >
                <Text style={styles.paragraph}>
                        REGULAR {"\n"} 2.09/gal
                </Text>
                </Card>
                <Card size="12" title="Plus">
                <Text style={styles.paragraph}>
                        PLUS {"\n"} 3.09/gal
                </Text>
                </Card>
            </View>

            <View style={styles.col1}>
                <Card title="Super">
                <Text style={styles.paragraph}>
                        SUPER {"\n"} 3.59/gal
                </Text>
                </Card>
                <Card title="Diesel">
                <Text style={styles.paragraph}>
                        DIESEL {"\n"}3.69/gal
                </Text>
                </Card>
            </View>  
        </View>
      
      <View>
        <Text style={styles.dealsText}>Find Deals on{"\n"}In-store Purchase{"\n"}Deli Food{"\n"}And SAVE on Gas{"\n"}with Fuel Rewards Deals</Text>
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
  mapFix:{
    width: 400,
    height: 300
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
    color: '#6e012a',
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
  }
});
