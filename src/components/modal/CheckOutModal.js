import React from "react";
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "react-native-paper";
import {USER_CHECKOUT} from "../../store/actions";
import {useNavigation} from "@react-navigation/native";

export const CheckOutModal = ({open, onClose}) => {

    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();
    const authUser = useSelector(state=>state.firebase.profile);
    const navigation = useNavigation();

    const cart = useSelector((state)=>state.auth.cart);

    const handlePress = async () => {
        if(authUser.isEmpty){
            Alert.alert(
                'Don\'t miss out on deals and discounts',
                'Get discounts on in-store purchases and daily update in deli menu',
                [
                    {
                        style:'cancel',
                        text:'Cancel'
                    },
                    {
                        text:'LogIn Now',
                        onPress:()=>{
                            navigation.navigate('SignIn');
                            onClose();
                        }
                    }
                ]
            )
        } else {
            await dispatch({ type: USER_CHECKOUT})
            alert("Your order has been placed");
            onClose();
        }
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
                    {
                        cart.items.map((item, index)=>(
                           <View key={index} style={styles.cartItem}>
                               <View style={styles.itemAmount}>
                                   <Text style={{color:'#87ceeb', fontSize: 16}}>{item.amount}</Text>
                               </View>
                               <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>{item.deli.title}</Text>
                               <Text style={styles.priceText}>${item.amount * (item.deli.price ||  50)}.00</Text>
                           </View>
                        ))
                    }
                    <View style={styles.cartItem}>
                        <Text style={{paddingLeft: theme.wp('5%'), fontSize: 16}}>Total</Text>
                        <Text style={styles.priceText}>${cart.totalPrice}</Text>
                    </View>
                    <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                        <Text style={{color:'white', fontSize: 24, fontWeight:'bold'}}>Pay at Store</Text>
                    </TouchableOpacity>
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
