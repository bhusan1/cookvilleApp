import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const AddButton = ({onPress, show}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    if (!show) {
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <AntDesign name="plus" size={theme.wp('7%')} color={'white'} />
        </TouchableOpacity>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        button: {
            position: 'absolute',
            bottom: theme.hp('5%'),
            width: theme.wp('12%'),
            height: theme.wp('12%'),
            right: theme.wp('7%'),
            alignSelf: 'flex-end',
            backgroundColor: theme.colors.secondary,
            borderRadius: theme.wp('6%'),
            justifyContent: 'center',
            alignItems: 'center',
            ...theme.styles.shadow,
            zIndex: 10500,
        },
    });
