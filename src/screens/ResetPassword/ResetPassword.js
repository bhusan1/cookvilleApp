import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { firebase } from '../../firebase/config';

export default function ResetPassword({navigation}) {
    const[email, setEmail] =useState('')
    
    const passwordReset = () => {
        firebase
                .auth()
                .sendPasswordResetEmail(email.trim())
                .then(function(user) {
                    alert('Kindly check your email and follow the link to reset your password.')
                })
            .catch(error => {
                alert(error)
            });
        }

        return(
            <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={styles.input}
                    placeholder='Enter email address'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => passwordReset()}>
                    <Text style={styles.buttonTitle}>Send Email</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        )
   
}