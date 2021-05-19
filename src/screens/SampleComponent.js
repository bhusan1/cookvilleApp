import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';

export const SampleComponent = () => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.root}>
            <Text>Sample Component</Text>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
        },
    });
