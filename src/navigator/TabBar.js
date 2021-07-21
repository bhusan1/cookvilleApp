import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TabBarItem} from "./TabBarItem";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export const TabBar = ({state, ...rest}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.root, {paddingBottom: insets.bottom, paddingTop: theme.hp('1%')}]}>
            {state.routes.map((route, index) => (
                <TabBarItem {...rest} route={route} state={state} index={index} key={index} />
            ))}
        </View>
    );
};

const useStyles = theme =>
    StyleSheet.create({
        root: {
            width: '100%',
            flexDirection:'row',
            justifyContent:'space-around',
            backgroundColor:theme.colors.main,
        },
    });
