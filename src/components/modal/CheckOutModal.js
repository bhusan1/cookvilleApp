import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useDispatch, useSelector} from "react-redux";
import {useTheme} from "react-native-paper";
import {USER_CHECKOUT} from "../../store/actions";

export const CheckOutModal = ({open, onClose}) => {

    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    const cart = useSelector((state)=>state.auth.cart);

    const handlePress = async () => {
        await dispatch({ type: USER_CHECKOUT})
        onClose();
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
                               <Text style={styles.priceText}>${item.amount * 50}.00</Text>
                           </View>
                        ))
                    }
                    <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                        <Text style={{color:'white', fontSize: 24, fontWeight:'bold'}}>CHECKOUT</Text>
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
