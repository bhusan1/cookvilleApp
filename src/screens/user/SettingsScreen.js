import React from 'react';
import {Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';

import {Button} from "../../components";
import {useDispatch} from "react-redux";
import {userLogout} from "../../store/actions";

export const SettingsScreen = () => {
    
    const dispatch = useDispatch();
    
    const signOut = () => {
        dispatch(userLogout())
    }

    return (
      <SafeAreaView style={styles.root}>
          <Button title="Sign Out" onPress={signOut} />
        <Text style={styles.text}> Once signed out, requires password to login again</Text>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  root: {
        flex: 1,
      width:'100%',
      marginTop: StatusBar.currentHeight,
  },
  text:{
    fontSize: 14,
    textAlign: 'center'
  }
});
