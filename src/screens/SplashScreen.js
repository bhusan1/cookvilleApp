import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Platform, BackHandler} from 'react-native';
import {useTheme} from 'react-native-paper';
import {imgSplash} from "../commons/images";
import * as Font from "expo-font";
import {authCheck} from "../store/actions";
import {useDispatch, useSelector} from "react-redux";
import * as ExpoSplashScreen from "expo-splash-screen";

export const SplashScreen = ({navigation}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const dispatch = useDispatch();

    const authUser = useSelector(state=>state.firebase.profile);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                OpenSans: require('../assets/fonts/OpenSans-Regular.ttf'),
                OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),
            });

            const isLoggedIn = await dispatch(authCheck());

            if(isLoggedIn){
                if(authUser.muteNotifications){
                    navigation.reset({
                        index: 1,
                        routes:[{name:'AllowNotification'}]
                    });
                }else {
                    navigation.reset({
                        index: 1,
                        routes:[{name:'UserBoard'}]
                    });
                }
            }else {
                navigation.reset({
                    index: 1,
                    routes:[{name:'SignIn'}]
                });
            }

            await ExpoSplashScreen.hideAsync();
        })();
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
        }

    }, []);

    return (
        <View style={styles.root}>
            <Image source={imgSplash} style={styles.image} />
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
            height: theme.hp('100%'),
            width: theme.wp('100%'),
        },
        image:{
            height: '100%',
            width: '100%',
            resizeMode:'stretch'
        }
    });
