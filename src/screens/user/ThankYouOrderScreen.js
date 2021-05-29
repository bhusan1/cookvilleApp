import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from "react-redux";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {USER_CLEAR_CART} from "../../store/actions";

export const ThankYouOrderScreen = ({navigation}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const cart = useSelector((state)=>state.auth.cart);
    const inserts = useSafeAreaInsets();
    const dispatch = useDispatch();

    const handlePress = async () => {
        await dispatch({type: USER_CLEAR_CART});
        navigation.goBack();
    }

    return (
        <View style={[styles.root,{paddingTop: inserts.top}]}>
            <View style={styles.content}>
                <View>
                    <Text style={styles.thankYou}>Thank you for your order</Text>
                </View>
                {
                    cart.items.map((item, index)=>(
                        <View key={index} style={styles.cartItem}>
                            <View style={styles.itemAmount}>
                                <Text style={{color:'#87ceeb', fontSize: 16}}>{item.amount}</Text>
                            </View>
                            <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>{item.deli.title}</Text>
                            <Text style={styles.priceText}>${item.amount * (item.deli.price ||  5)}.00</Text>
                        </View>
                    ))
                }
                <View style={styles.cartItem}>
                    <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>Total</Text>
                    <Text style={styles.priceText}>${cart.totalPrice}</Text>
                </View>
                <View style={{marginTop: theme.hp('4%')}}>
                    <Text>Your order will be ready to pick up in 5 mins.</Text>
                </View>
                <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                    <Text style={{color:'white', fontSize: 24, fontWeight:'bold'}}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: theme.wp('100%'),
            height: theme.hp('100%'),
            backgroundColor:'white',
            justifyContent:'flex-end',
            position:'relative'
        },
        closeIcon: {
            position: 'absolute',
            top: theme.hp('2%'),
            right: theme.hp('2%'),
        },
        content:{
            flex: 1,
            width:'100%',
            height:'100%',
            backgroundColor:'white',
            alignItems:'center',
            paddingTop: theme.hp('10%'),
            paddingHorizontal: theme.wp('5%')
        },
        thankYou:{
            fontSize: 30,
            fontWeight:'bold',
            paddingVertical: theme.hp('4%'),
            color:'#555555',
            textAlign:'center'
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
        addCartBtn:{
            width: '50%',
            height: 45,
            borderRadius: 4,
            marginTop: theme.hp('5%'),
            backgroundColor: '#87ceeb',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
