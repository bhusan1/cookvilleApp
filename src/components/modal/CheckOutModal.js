import React, {useState} from "react";
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View, FlatList} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "react-native-paper";
import {decreaseCartItem, increaseCartItem, USER_CHECKOUT} from "../../store/actions";
import {useNavigation} from "@react-navigation/native";
import * as MailComposer from 'expo-mail-composer';
import {useFirestore} from "react-redux-firebase";
import SwipeOut from 'react-native-swipeout';
import {deleteCartItem} from "../../store/actions";
import AntDesign from 'react-native-vector-icons/AntDesign';

export const CheckOutModal = ({open, onClose}) => {

    const theme = useTheme();
    const navigation = useNavigation();
    const styles = useStyles(theme);
    const dispatch = useDispatch();
    const authUser = useSelector(state=>state.firebase.profile);
    const firestore = useFirestore();
    const [itemToDelete, setItemToDelete] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const cart = useSelector((state)=>state.auth.cart);

    const handlePress = async () => {
        if(authUser.isEmpty){
            Alert.alert(
                'You are missing out on deals and discounts!!!',
                'Get discounts on in-store purchases and daily update in deli menu',
                [
                    {
                        style:'cancel',
                        text:'Cancel'
                    },
                    {
                        text:'Login Now',
                        onPress:()=>{
                            navigation.navigate('SignIn');
                            onClose();
                        }
                    }
                ]
            )
        } else {
            if(await sendEmail()){
                await firestore.collection('orders').add({
                    customerId: authUser.uid,
                    orderTime: new Date().getTime(),
                    order: cart,
                });
                await dispatch({ type: USER_CHECKOUT})
                onClose();
                navigation.navigate('ThankYou');
            }else {
                Alert.alert('Canceled','Please send the email to make your order!')
            }
        }
    }

    const sendEmail = async () => {
        return new Promise(resolve => {
            let body = '<html><body>';
            body += '<h1>Your order Summary</h1>';
            body += '<table width="350" style="border-collapse: collapse">';
            cart.items.forEach((item, index)=>{
                body += `<tr>
                        <td style="border: solid 1px #555555;">${index + 1}</td>
                        <td style="border: solid 1px #555555;">${item.deli.title}</td>
                        <td style="border: solid 1px #555555;">$${item.amount * (item.deli.price ||  5)}.00</td>
                    </tr>`;
            });
            body += `<tr><td colspan="2" style="border: solid 1px #555555;">Total</td><td style="border: solid 1px #555555;">$${cart.totalPrice}</td></tr>`;
            body += '</table>';
            body += '</body></html>';

            MailComposer.composeAsync({
                subject:'Order Deli',
                recipients:['ordercookville@gmail.com','thomas19891230@outlook.com'],
                isHtml: true,
                body: body,
            }).then(res=>{
                if(res.status === 'cancelled'){
                    resolve(false)
                }else {
                    resolve(true);
                }
            }).catch(err=>{
                console.log(err);
                resolve(false);
            })
        })

    }

    const swipeOutButtons = [
        {
            text: 'Delete',
            backgroundColor:'red',
            onPress: () => {
                dispatch(deleteCartItem({deli: itemToDelete.deli}));
                setRefresh(!refresh);
            }
        }
    ]

    const handleMinus = (deli) => {
        dispatch(decreaseCartItem({deli}))
    }

    const handlePlus = (deli) => {
        dispatch(increaseCartItem({deli}))
    }

    if(!open){
        return  null;
    }

    return (
        <Modal  animationType="slide" transparent={true} visible={open} >
            <View style={styles.root}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <EvilIcons name={'close'} size={36} style={{fontSize: 24, fontWeight:'900'}} />
                    </TouchableOpacity>
                    <FlatList
                        data={cart.items}
                        extraData={refresh}
                        renderItem={({item})=>(
                            <SwipeOut
                                onOpen={()=>{ setItemToDelete(item) }}
                                autoClose
                                right={swipeOutButtons}
                            >
                                <View style={styles.cartItem}>
                                    <Text style={{fontSize: 16}}>{item.deli.title}</Text>
                                    <View style={styles.itemAmountControl}>
                                        <TouchableOpacity style={styles.itemAmount} onPress={()=>{handleMinus(item.deli)}}>
                                            <AntDesign name={'minus'} size={16} color={'#87ceeb'}/>
                                        </TouchableOpacity>
                                        <Text style={{color:'#87ceeb', fontSize: 16, paddingHorizontal: theme.wp('2%')}}>{item.amount}</Text>
                                        <TouchableOpacity style={styles.itemAmount} onPress={()=>{handlePlus(item.deli)}}>
                                            <AntDesign name={'plus'} size={16} color={'#87ceeb'}/>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.priceText}>${item.amount * (item.deli.price ||  5)}.00</Text>
                                </View>
                            </SwipeOut>
                        )}
                        keyExtractor={(item)=>item.deli.id}
                        ListFooterComponent={()=>(
                            <View style={{alignItems:'center'}}>
                                <View style={[styles.cartItem,{borderBottomWidth: 0.5}]}>
                                    <Text style={{fontSize: 16}}>Total</Text>
                                    <Text style={[styles.priceText,{marginLeft:'auto'}]}>${cart.totalPrice}</Text>
                                </View>
                                <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                                    <Text style={{color:'white', fontSize: 24, fontWeight:'bold'}}>Place Order</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
        </Modal>
    )
}

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: theme.wp('100%'),
            height: theme.hp('100%'),
            backgroundColor:'#0000002f',
            justifyContent:'flex-end',
            position:'relative'
        },
        closeIcon: {
            position: 'absolute',
            top: theme.hp('2%'),
            right: theme.hp('2%'),
        },
        content:{
            paddingTop: theme.hp('10%'),
            paddingHorizontal: 10,
            alignItems:'center',
            width:'100%',
            height:theme.hp('84%'),
            backgroundColor:'white',
            borderTopRightRadius: theme.hp('3%'),
            borderTopLeftRadius: theme.hp('3%'),
        },
        cartItem:{
            width:'100%',
            height: theme.hp('6%'),
            alignItems:'center',
            borderTopWidth: 0.5,
            flexDirection:'row',
            backgroundColor:'white',
        },
        itemAmountControl:{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: theme.wp('1%'),
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
            fontSize: 16,
            width: theme.wp('20%'),
            textAlign:'right'
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
