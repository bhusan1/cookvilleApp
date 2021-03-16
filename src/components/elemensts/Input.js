import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const Input = ({name, value, onChangeText, isInvalid=false, ...props}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <TextInput
            name={name}
            value={value}
            autoCapitalize="none"
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            onChangeText={(text) => onChangeText(name, text)} //... Bind the name here
            style={[styles.textInputStyle, {borderColor: isInvalid ? theme.colors.danger : theme.colors.border}]}
            {...props}
        />
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        textInputStyle: {
            backgroundColor: 'white',
            width: '100%',
            height: 48,
            maxWidth: 400,
            borderRadius: 5,
            marginVertical: 4,
            padding: 0,
            paddingLeft: 10,
            fontSize: 18,
            fontFamily: theme.fonts.regular,
            textAlignVertical: 'top',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
    });
