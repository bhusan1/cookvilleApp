import React, { Component } from 'react';
import { View, Text, Button, StyleSheet,LayoutAnimation,Image, ScrollView, Platform, UIManager, TouchableOpacity } from 'react-native';



export default class DealsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Deals',
  });

  constructor() {
    super();
  
    this.state = { expanded: false }
  
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  }
    render() {
    return(
      <ScrollView>
        <Text style={styles.headText}>
          OnGoing Deals
        </Text> 

        <View style={styles.saCon}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.Btn}>
          <Text style={styles.gasText}>Buy $20 inside store</Text>
          <Text style={styles.dealsText}> Get 2% off on your total </Text>
          <Text style={styles.dateText}> Offer ends 1-22-2021 </Text>
          </TouchableOpacity>
          <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
            <Image source={require('../../../assets/barcode.jpg')} style={{ width: 300, height: 100 }}/>
          </View>
        </View>

        <View style={styles.divider}></View> 

        <View style={styles.saCon}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.Btn}>
          <Text style={styles.gasText}>Buy $50 inside store</Text>
          <Text style={styles.dealsText}> Get 5% off on your total </Text>
          <Text style={styles.dateText}> Offer ends 1-22-2021 </Text>
          </TouchableOpacity>
          <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
            <Image source={require('../../../assets/barcode.jpg')} style={{ width: 300, height: 100 }}/>
          </View>
        </View>

        <View style={styles.divider}></View> 
     
        <View style={styles.saCon}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.Btn}>
          <Text style={styles.gasText}>Buy $100 inside store</Text>
          <Text style={styles.dealsText}> Get 10% off on your total </Text>
          <Text style={styles.dateText}> Offer ends 1-22-2021 </Text>
          </TouchableOpacity>
          <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
            <Image source={require('../../../assets/barcode.jpg')} style={{ width: 300, height: 100 }}/>
          </View>
        </View>


      </ScrollView>
    );
  } 
}  

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  headText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20
  },
  divider: {
    paddingTop: 2
  },
  saCon: {
    padding: 20,
    backgroundColor: '#fff'
  },
  gasText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20
  },
  dealsText: {
    fontSize: 15,
    color: 'black',
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom:10
  },
  dateText: {
    fontSize: 10,
    color: 'black',
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 2,
  },

  Btn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  text: {
    fontSize: 17,
    color: 'black',
    padding: 10
  },
});