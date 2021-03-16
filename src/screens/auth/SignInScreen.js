import React, {useRef} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {useTheme} from "react-native-paper";

import {imgIcon} from "../../commons/images";
import {SignInForm} from "../../components/auth/SignInForm";
import {Button} from "../../components";

export const SignInScreen = ({navigation}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const signInFormRef = useRef();

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const goToResetPassword = () => {navigation.navigate('Reset Password')}


    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView  keyboardShouldPersistTaps="always">
                <View style={styles.content}>
                    <Image
                        style={styles.logo}
                        source={imgIcon}
                    />
                    <SignInForm ref={signInFormRef}/>
                    <View style={styles.footerView}>
                        <Text onPress={goToResetPassword} style={styles.footerLink}>Forgot Password?</Text>
                    </View>
                    <Button
                        title={'Log In'}
                        style={styles.button}
                        onPress={signInFormRef.current?.submit}/>
                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const useStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        width:'90%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent:'center',
    },
    logo: {
        height: theme.wp('40%'),
        resizeMode:'contain',
        alignSelf:'center',
        marginTop: theme.hp('20%')
    },
    button: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
})
