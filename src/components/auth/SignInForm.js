import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Input} from "../elemensts";
import {useDispatch} from "react-redux";
import {signInWithFirebase} from "../../store/actions/AuthAction";
import {validate} from "../../commons/helper";


const INITIAL_STATE = {
    email: null,
    password: null,
}

export const SignInForm = forwardRef((props, ref) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    const [user, setUser] = useState(INITIAL_STATE)

    const handleChange = (name, value) => {
        setUser({...user, [name]: value});
    }

    useImperativeHandle(ref, ()=>({
        submit(){
            if(validate(user, {email: 'required|email', password: 'required|min:8'})){
                dispatch(signInWithFirebase(user));
            }
        }
    }))


    return (
        <View style={styles.root}>
            <Input
                name={'email'}
                value={user.email}
                placeholder='Email'
                onChangeText={handleChange}
            />
            <Input
                style={styles.input}
                secureTextEntry
                placeholder='Password'
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
        },
    });
