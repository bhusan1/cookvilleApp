import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Input} from '../../components';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {sendEmailForRecovery} from '../../store/actions/AuthAction';
import {imgIcon} from '../../commons/images';

export const ResetPasswordScreen = ({navigation}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dispatch = useDispatch();

    const [email, setEmail] = useState(null);

    const passwordReset = () => {
        dispatch(sendEmailForRecovery(email));
    };

    const onFooterLinkPress = () => {
        navigation.navigate('SignIn');
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{flex: 1, width: '100%'}} keyboardShouldPersistTaps="always">
                <View style={styles.content}>
                    <Image style={styles.logo} source={imgIcon} />
                    <Input
                        placeholder="Enter email address"
                        onChangeText={(name, value) => setEmail(value)}
                        value={email}
                    />
                    <Button title={'Send Email'} onPress={passwordReset} />
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>
                            Already got an account?{' '}
                            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                                Go Back
                            </Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'white',
        },
        content: {
            flex: 1,
            width: '90%',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
        },
        logo: {
            height: theme.wp('40%'),
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: theme.hp('20%'),
        },
        footerView: {
            flex: 1,
            alignItems: 'center',
            marginTop: 20,
        },
        footerText: {
            fontSize: 16,
            color: '#2e2e2d',
        },
        footerLink: {
            color: '#788eec',
            fontWeight: 'bold',
            fontSize: 16,
        },
    });
