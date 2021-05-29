import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import moment from "moment";

export const OrderHistoryScreen = () => {

    const authUser = useSelector(state=>state.firebase.profile);

    useFirestoreConnect([{
        collection:'orders',
        where:[['customerId','==', authUser.uid]],
    }])

    const orders = useSelector(state=>state.firestore.ordered.orders || [])
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.root}>
            {
                orders.map((order, index)=>(
                    <View key={index} style={{marginTop: 20}}>
                        <View>
                            <Text style={{fontSize: 18, fontWeight:'bold'}}>
                                {index+1}. {moment(order.orderTime).format('MM/DD/YYYY h:mm:ss')}
                            </Text>
                        </View>
                        <View>
                            {
                                order.order.items.map((item, key)=>(
                                    <View key={key} style={styles.cartItem}>
                                        <View style={styles.itemAmount}>
                                            <Text style={{color:'#87ceeb', fontSize: 16}}>{item.amount}</Text>
                                        </View>
                                        <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>{item.deli.title}</Text>
                                        <Text style={styles.priceText}>${item.amount * (item.deli.price ||  5)}.00</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                ))
            }
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
            backgroundColor:'white',
            padding: theme.wp('5%'),
        },
        cartItem:{
            width:'100%',
            height: theme.hp('6%'),
            alignItems:'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#8080807f',
            flexDirection:'row'
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
    });
