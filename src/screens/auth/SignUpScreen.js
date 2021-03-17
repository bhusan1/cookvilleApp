import React, {useRef} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SignUpForm} from '../../components/auth/SignUpForm';
import {Button} from '../../components';
import {useTheme} from 'react-native-paper';
import {imgIcon} from '../../commons/images';

export const SignUpScreen = ({navigation}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const signUpFormRef = useRef(null);

    const signUp = () => {
        if (signUpFormRef?.current) {
            signUpFormRef.current?.submit();
        }
    };

    const onFooterLinkPress = () => {
        navigation.navigate('SignIn');
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.content}>
                    <Image style={styles.logo} source={imgIcon} />
                    <SignUpForm ref={signUpFormRef} />
                    <Button title={'Create Account'} onPress={signUp} />
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>
                            Already got an account?{' '}
                            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                                Log in
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
            marginTop: theme.hp('10%'),
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
