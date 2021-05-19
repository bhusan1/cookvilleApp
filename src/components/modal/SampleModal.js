import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {useTheme} from "react-native-paper";

export const SampleModal = ({open, onClose}) => {

    const theme = useTheme();
    const styles = useStyles(theme);

    const handlePress = () => {
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

                    <TouchableOpacity style={styles.addCartBtn} onPress={handlePress}>
                        <Text style={{color:'white', fontSize: 24, fontWeight:'bold'}}>Add to cart</Text>
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
            paddingTop: theme.hp('6%'),
            paddingHorizontal: 10,
            alignItems:'center',
            width:'100%',
            height:theme.hp('84%'),
            backgroundColor:'white',
            borderTopRightRadius: theme.hp('3%'),
            borderTopLeftRadius: theme.hp('3%'),
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
