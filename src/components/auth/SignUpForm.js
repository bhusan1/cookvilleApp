import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Input} from '../elemensts';
import {useDispatch, useSelector} from 'react-redux';
import {signUpUserInFirebase} from '../../store/actions';
import {validate} from '../../commons/helper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from "@react-navigation/native";
import {useFirebase} from "react-redux-firebase";

const INITIAL_STATE = {
    fullName: null,
    phoneNumber: null,
    email: null,
    password: null,
    confirmPassword: null,
};
let mounted = false;
export const SignUpForm = forwardRef((props, ref) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();
    const firebase = useFirebase();
    const navigation = useNavigation();

    const [user, setUser] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setUser({...user, [name]: value});
    };

    useImperativeHandle(ref, () => ({
        submit() {
            if (
                validate(user, {
                    fullName: 'required',
                    email: 'required|email',
                    phoneNumber: 'optional',
                    password: 'required|min:8|same:confirmPassword',
                })
            ) {
                setLoading(true);
                dispatch(signUpUserInFirebase(user)).then(() => {
                    if(mounted){
                        setLoading(false);
                    }
                });
            }
        },
    }));

    useEffect(()=>{
        mounted = true;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                navigation.reset({index:0,routes:[{name:'UserBoard'}]});
            } else {
                // No user is signed in.
            }
        });
        return ()=>{
            mounted = false;
        }
    }, [])

    return (
        <View style={styles.root}>
            <Spinner visible={loading} textContent={'Loading...'} textStyle={{color: 'white'}} />
            <Input name={'fullName'} value={user.fullName} placeholder="Full Name" onChangeText={handleChange} />
            <Input name={'email'} value={user.email} placeholder="Email" onChangeText={handleChange} />
            <Input name={'phoneNumber'} value={user.phoneNumber} placeholder="Phone Number (optional)" onChangeText={handleChange}/>
            <Input
                name={'password'}
                secureTextEntry
                placeholder="Password"
                onChangeText={handleChange}
                value={user.password}
            />
            <Input
                name={'confirmPassword'}
                secureTextEntry
                placeholder="Confirm Password"
                onChangeText={handleChange}
                value={user.confirmPassword}
            />
        </View>
    );
});

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
            alignItems:'center',
        },
    });
