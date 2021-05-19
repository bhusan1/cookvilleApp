import React, {useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Input} from '../elemensts';
import {useDispatch, useSelector} from 'react-redux';
import {signInWithFirebase} from '../../store/actions';
import {validate} from '../../commons/helper';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import {useFirebase} from "react-redux-firebase";

const INITIAL_STATE = {
    email: null,
    password: null,
};
let mounted = false;
export const SignInForm = forwardRef((props, ref) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const firebase = useFirebase();

    const [user, setUser] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setUser({...user, [name]: value});
    };

    useImperativeHandle(ref, () => ({
        submit() {
            if (validate(user, {email: 'required|email', password: 'required|min:8'})) {
                setLoading(true);
                dispatch(signInWithFirebase(user)).then(() => {
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
            <Input name={'email'} value={user.email} placeholder="Email" onChangeText={handleChange} />
            <Input
                name={'password'}
                secureTextEntry
                placeholder="Password"
                onChangeText={handleChange}
                value={user.password}
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
