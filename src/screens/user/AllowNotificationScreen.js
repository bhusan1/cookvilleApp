import React from 'react';
import {View, StyleSheet, Text, StatusBar} from 'react-native';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Button} from "../../components";
import {useSelector} from "react-redux";
import {useFirestore} from "react-redux-firebase";

export const AllowNotificationScreen = ({navigation}) => {
    /**
     * use external hooks
     */
    const theme = useTheme();
    const styles = useStyles(theme);
    const firestore = useFirestore();
    const authUser = useSelector(state=>state.firebase.profile);
    
    const handlePress = () => {
        firestore.collection('users').doc(authUser.uid)
            .update({muteNotifications: false}).then(()=>{
            navigation.reset({index: 0, routes:[{name:'UserBoard'}]})
        })
    }
    
    const skip = () => {
        navigation.reset({index: 0, routes:[{name:'UserBoard'}]})
    }
    
    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <View style={{position: 'relative'}}>
                    <View style={styles.badge}/>
                    <MaterialCommunityIcons name={'message-processing-outline'} size={theme.wp('50%')} color={'#2751b7'}/>
                </View>
                <Text style={styles.textStyle1}>Turn on Notifications to stay updated on your rewards.</Text>
                <Text style={styles.textStyle2}>You can change your notification preferences in your settings any time</Text>
                <Button title={'Allow Notifications'} style={styles.buttonStyle} titleStyle={styles.buttonTitleStyle} onPress={handlePress}/>
                <Text style={styles.textSkip} onPress={skip}>Skip</Text>
            </View>
        </View>
    );
};

/**
 * use styles with theme
 * @param theme
 */
const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            alignItems:'center',
            justifyContent:'center',
        },
        content:{
            flex: 1,
            width:'100%',
            padding: theme.wp('5%'),
            alignItems: 'center',
            justifyContent: 'center',
        },
        textSkip:{
            color: theme.colors.danger,
            fontSize: 18,
            marginTop: 20,
            fontFamily: theme.fonts.bold,
        },
        buttonStyle:{
            backgroundColor: '#c52030',
            marginTop: 30,
            width:'80%',
            borderRadius: 4,
        },
        buttonTitleStyle:{
          textTransform:'uppercase',
          fontFamily: theme.fonts.regular
        },
        textStyle1:{
            color: 'black',
            fontSize: 18,
            fontFamily: theme.fonts.bold,
            textAlign: 'center',
            marginTop: 20,
        },
        textStyle2:{
            color: 'black',
            fontSize: 16,
            fontFamily: theme.fonts.regular,
            textAlign: 'center',
            marginVertical: 20,
        },
        badge:{
            backgroundColor:'#c52030',
            width: 50,
            height: 50,
            borderRadius: 25,
            position:'absolute',
            right: 0,
            top: 0,
            zIndex: 2,
        }
    });
