import React from "react";
import {Keyboard, TouchableWithoutFeedback, View} from "react-native";
import {useTheme} from "react-native-paper";

export const Overlay = ({children, isVisible}) => {

    const theme = useTheme();

    if(!isVisible){
        return null;
    }

    return (
        <TouchableWithoutFeedback
            onPress={()=>{Keyboard.dismiss()}}
        >
            <View
                style={{
                    position: "absolute",
                    height: theme.hp('100%'),
                    width: theme.wp('100%'),
                    top: 0,
                    left: 0,
                    flex: 1,
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex: 100,
                    backgroundColor: '#000000af'
                }}
            >
                <View style={{
                    padding: 10,
                    borderRadius: 3,
                    backgroundColor:'white',
                    ...theme.styles.shadow
                }}>
                    {children}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
