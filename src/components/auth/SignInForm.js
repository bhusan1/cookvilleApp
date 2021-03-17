import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Input} from '../elemensts';
import {useDispatch} from 'react-redux';
import {signInWithFirebase} from '../../store/actions';
import {validate} from '../../commons/helper';
import Spinner from 'react-native-loading-spinner-overlay';

const INITIAL_STATE = {
    email: null,
    password: null,
};

export const SignInForm = forwardRef((props, ref) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    const [user, setUser] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setUser({...user, [name]: value});
    };

    useImperativeHandle(ref, () => ({
        submit() {
            if (validate(user, {email: 'required|email', password: 'required|min:8'})) {
                // setLoading(true);
                dispatch(signInWithFirebase(user)).then(() => {
                    setLoading(false);
                });
            }
        },
    }));

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
        },
    });
