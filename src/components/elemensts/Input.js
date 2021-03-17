import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const Input = ({name, style, value, onChangeText, isInvalid = false, ...props}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <TextInput
            {...props}
            name={name}
            value={value}
            autoCapitalize="none"
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            onChangeText={(text) => onChangeText(name, text)} //... Bind the name here
            style={[styles.textInputStyle, style]}
        />
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        textInputStyle: {
            backgroundColor: 'white',
            width: '100%',
            height: 40,
            maxWidth: 400,
            borderRadius: 5,
            marginVertical: 4,
            padding: 0,
            paddingLeft: 10,
            fontSize: 16,
            fontFamily: theme.fonts.regular,
            textAlignVertical: 'center',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderColor: theme.colors.border,
            marginTop: theme.hp('1%'),
        },
    });
