import React, {useEffect, useState} from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "react-native-paper";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useDispatch} from "react-redux";
import {addCart} from "../../store/actions";

export const DeliDetailModal = ({deli, open, onClose}) => {
    const [amount, setAmount] = useState(1);
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    useEffect(()=>{
        setAmount(1)
    },[deli])

    const increaseAmount = () => {
        setAmount(amount + 1)
    }

    const decreaseAmount = () => {
        if(amount > 1){
            setAmount(amount - 1);
        }
    }

    const handlePress = () => {
        dispatch(addCart({deli, amount}));
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
                    <Image style={styles.photo} source={{uri: deli.image}}  />
                    <Text style={{fontSize: 20, marginTop: 20}}>{deli.title}</Text>
                    <View style={styles.amountArea}>
                        <TouchableOpacity onPress={decreaseAmount}>
                            <AntDesign name={'minuscircle'} color={'#87ceeb'} size={35}/>
                        </TouchableOpacity>
                        <Text style={{fontSize: 24}}>{amount}</Text>
                        <TouchableOpacity onPress={increaseAmount}>
                            <AntDesign name={'pluscircle'} color={'#87ceeb'} size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop: theme.hp('5%')}}>
                        <View style={styles.priceBox}>
                            <Text style={{fontSize: 18}}>${(deli.price || 5) * amount}</Text>
                        </View>
                        <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                            <Text style={{color:'white', fontSize: 18, fontWeight:'bold'}}>Add to cart</Text>
                        </TouchableOpacity>
                    </View>
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
            paddingTop: theme.hp('6%'),
            paddingHorizontal: 10,
            alignItems:'center',
            width:'100%',
            height:theme.hp('84%'),
            backgroundColor:'white',
            borderTopRightRadius: theme.hp('3%'),
            borderTopLeftRadius: theme.hp('3%'),
        },
        photo: {
            width: '100%',
            height: 300,
            borderRadius: 5,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            resizeMode:'cover',
        },
        amountArea:{
            width:'50%',
            height: 50,
            alignItems: 'center',
            justifyContent:'space-between',
            borderRadius: 100,
            borderColor:'#8080805f',
            borderWidth: 1,
            marginTop: theme.hp('5%'),
            flexDirection:'row',
            paddingHorizontal: 7
        },
        addCartBtn:{
            width: '50%',
            paddingHorizontal: theme.wp('8%'),
            height: 45,
            borderRadius: 4,
            backgroundColor: '#87ceeb',
            justifyContent: 'center',
            alignItems: 'center',
        },
        priceBox: {
            ...theme.styles.center,
            borderWidth: 1,
            borderRadius: theme.wp('1%'),
            height: 45,
            borderColor: '#8080807f',
            width: 80,
            marginRight: theme.wp('3%')
        }
    });
