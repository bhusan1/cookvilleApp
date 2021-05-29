import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useSelector} from "react-redux";
import {useFirestoreConnect} from "react-redux-firebase";
import {useTheme} from "react-native-paper";
import moment from "moment";


export const TrackOrder = ({}) => {

    const authUser = useSelector(state=>state.firebase.profile);
    const date = new Date();
    const currentTime = date.getTime();

    useFirestoreConnect([{
        collection:'orders',
        where:[['customerId','==', authUser.uid]],
        storeAs:'activeOrder'
    }])

    const orders = useSelector(state=>state.firestore.ordered.activeOrder || []);
    const activeOrder = orders.find(item=>(currentTime - item.orderTime) < 60 * 5 * 3600);

    const theme = useTheme();
    const styles = useStyles(theme);

    return (

        <View style={styles.root}>
            <View>
                {
                    typeof activeOrder === 'undefined' ?
                        <View style={{width:'100%', marginTop: 20}}>
                            <Text style={styles.boldText}>No Order has been submitted for preparation!!!</Text>
                        </View>:
                        <View  style={{width:'100%'}}>
                            <View  style={{width:'100%', marginTop: 30}}>
                                <Text style={styles.boldText} >Your order is being prepared</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 16, color:'#6e012a', textAlign:'center', fontWeight:'bold'}}>{moment().format('MM/DD/YYYY')}</Text>
                            </View>
                            {
                                activeOrder.order.items.map((item, index)=>(
                                    <View key={index} style={styles.cartItem}>
                                        <View style={styles.itemAmount}>
                                            <Text style={{color:'#87ceeb', fontSize: 16}}>{item.amount}</Text>
                                        </View>
                                        <View style={styles.itemImage}>
                                            <Image source={{uri: item.image}} style={styles.orderImage}/>
                                        </View>
                                        <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>{item.deli.title}</Text>
                                        <Text style={styles.priceText}>${item.amount * (item.deli.price ||  5)}.00</Text>
                                    </View>
                                ))
                            }
                            <View style={styles.cartItem}>
                                <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>Total</Text>
                                <Text style={styles.priceText}>${activeOrder.order.totalPrice}</Text>
                            </View>
                            <View style={{marginTop: 20}}>
                                <Text style={styles.boldText}> ${activeOrder.order.totalPrice} due when you arrive at the store.</Text>
                                <Text style={styles.boldText}> We will notify when the order is ready for pickup.</Text>
                            </View>
                        </View>
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
            backgroundColor:'white',
            padding: theme.wp('5%')
        },
        cartItem:{
            width:'100%',
            height: theme.hp('6%'),
            alignItems:'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#8080807f',
            flexDirection:'row'
        },
        itemImage:{
            width: 50,
            height: 50
        },
        orderImage:{
            width:'100%',
            height:'100%',
            resizeMode:'cover'
        },
        itemAmount:{
            width: theme.wp('7%'),
            height: theme.wp('7%'),
            borderRadius: 1,
            borderColor:'#8080807f',
            borderWidth: 0.5,
            justifyContent:'center',
            alignItems:'center'
        },
        priceText:{
            marginLeft:'auto',
            fontSize: 16
        },
        boldText:{
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center'
        }
    });
