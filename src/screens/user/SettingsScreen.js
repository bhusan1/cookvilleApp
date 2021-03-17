import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {Button} from "../../components";
import {useDispatch} from "react-redux";
import {userLogout} from "../../store/actions/AuthAction";

export const SettingsScreen = ({navigation}) => {
    
    const dispatch = useDispatch();
    
    const signOut = () => {
        dispatch(userLogout())
    }

    return (
      <View style={styles.container}>
        <Button title="Sign Out" onPress={signOut} />
        <Text style={styles.text}> Once signed out, requires password to login again</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text:{
    fontSize: 10,
    textAlign: 'center'
  }
});
