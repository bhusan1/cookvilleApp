import {StyleSheet} from "react-native";

export const useStyles = theme =>
    StyleSheet.create({
        root: {
            width: '100%',
        },
        tabMenuItem:{
            backgroundColor:theme.colors.main,
            justifyContent:'center',
            alignItems:'center'
        },
        tabBarItem:{
            backgroundColor:'#6e012a',
            justifyContent:'center',
            alignItems:'center'
        },
        tabBarLabel:{
            color:'white'
        }
    });
