import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';

const INITIAL_SATE = {
    title: null,
    image: null,
    category: null,
}

export const AddDealScreen = () => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const [deal, setDeal] = useState();
    
    return (
        <View style={styles.root}>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
        },
    });
