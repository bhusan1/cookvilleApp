import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

export const Paper = (props) => {
    const {children, style, hidden, onPress, active = false} = props;
    const theme = useTheme();
    const styles = useStyles(theme);

    const rootStyle = [styles.root, theme.styles.shadow, style];

    if (onPress) {
        return (
            <>
                {hidden ? null : (
                    <TouchableOpacity onPress={onPress} style={rootStyle}>
                        {children}
                    </TouchableOpacity>
                )}
            </>
        );
    }
    return (
        <>
            {hidden ? null : (
                <View {...props} style={rootStyle}>
                    {children}
                </View>
            )}
        </>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            width: '90%',
            alignSelf: 'center',
            padding: theme.hp('1%'),
            borderRadius: theme.wp('1.5%'),
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1,
        },
    });
