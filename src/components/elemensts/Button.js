import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useTheme} from 'react-native-paper';

export const Button = ({title, onPress, style, titleStyle, icon}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} style={[styles.buttonStyle, style]}>
                <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.buttonStyle, style]}>
            <View style={{position: 'absolute', left: 20}}>{icon}</View>
            <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
        </View>
    );
};

const useStyles = (theme) => ({
    buttonStyle: {
        width: '100%',
        padding: theme.hp('1%'),
        maxWidth: 400,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary,
        marginVertical: 8,
        flexDirection: 'row',
        borderRadius: 5,
    },
    titleStyle: {
        fontSize: theme.hp('2%'),
        color: 'white',
        fontFamily: theme.fonts.bold,
        fontWeight: '900',
    },
});
