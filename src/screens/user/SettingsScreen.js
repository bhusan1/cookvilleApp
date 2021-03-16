import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';



import { firebase } from '../../firebase'

const SettingsScreen = ({navigation}) => {{

  const onLogoutPress = () => {
    firebase
        .auth()
        .signOut()
        .then( navigation.navigate('LoginScreen')) // was Login

    }

    return (

      <View style={styles.container}>
        <Button

          title="Sign Out"
          onPress={() => {onLogoutPress()}}
        />
        <Text style={styles.sout}> Once signed out, requires password to login again</Text>
      </View>

    );
};
};


export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sout:{
    fontSize: 10,
    textAlign: 'center'
  }

})
