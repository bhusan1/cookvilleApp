import React from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useStyles} from "./styles";
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from "react-redux";

export const TabBarItem = ({navigation, route, descriptors, state, index}) => {

    const theme = useTheme();
    const styles = useStyles(theme);
    const authUser = useSelector(state=>state.firebase.profile);

    const {options} = descriptors[route.key];

    const isFocused = state.index === index;

    const onPress = () => {
        if(index  > 1 && authUser.isEmpty){
            Alert.alert(
                'You are missing out on deals and discounts!!!',
                'Get discounts on in-store purchases and daily update in deli menu',
                [
                    {
                        style:'cancel',
                        text:'Cancel'
                    },
                    {
                        text:'Login Now',
                        onPress:()=>{
                            navigation.navigate('SignIn');
                        }
                    }
                ]
            )
        } else {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        }
    };

    const onLongPress = () => {
        navigation.emit({
            type: 'tabLongPress',
            target: route.key,
        });
    };

    const tabBarIcons = [
        <Icon name="ios-home" color={'white'} size={theme.hp(isFocused? '4%':'2.8%')} />,
        <Icon name="fast-food" color={'white'} size={theme.hp(isFocused? '4%':'2.8%')} />,
        <Icon name="color-filter" color={'white'} size={theme.hp(isFocused? '4%':'2.8%')} />,
        <Icon name="ios-notifications" color={'white'} size={theme.hp(isFocused? '4%':'2.8%')} />,
        <Icon name="ios-aperture" color={'white'} size={theme.hp(isFocused? '4%':'2.8%')} />
    ];

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}>
            <View style={styles.tabMenuItem}>
                {tabBarIcons[index]}
                {
                    !isFocused &&
                    <Text style={styles.tabBarLabel}>{options.tabBarLabel}</Text>
                }
            </View>
        </TouchableOpacity>
    );
};
