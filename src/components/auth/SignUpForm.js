import React, {useState, forwardRef} from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Input} from "../elemensts";
import {useDispatch} from "react-redux";
import {signUpUserInFirebase} from "../../store/actions/AuthAction";


const INITIAL_STATE = {
    fullName: null,
    phoneNumber: null,
    email: null,
    password: null,
    confirmPassword: null,
}

export const SignUpForm = forwardRef(() => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    const [user, setUser] = useState(INITIAL_STATE)

    const handleChange = (name, value) => {
        setUser({...user, [name]: value});
    }

    const submit = () => {
        dispatch(signUpUserInFirebase(user));
    }

    return (
        <View style={styles.root}>
            <Input
                name={'fullName'}
                value={user.fullName}
                placeholder='Full Name'
                onChangeText={handleChange}
            />
            <Input
                name={'email'}
                value={user.email}
                placeholder='Email'
                onChangeText={handleChange}
            />
            <Input
                name={'phoneNumber'}
                value={user.phoneNumber}
                placeholder='Phone Number'
                onChangeText={handleChange}
            />
            <Input
                style={styles.input}
                secureTextEntry
                placeholder='Password'
                onChangeText={handleChange}
                value={user.password}
            />
            <Input
                style={styles.input}
                secureTextEntry
                placeholder='Confirm Password'
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
        },
    });
