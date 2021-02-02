import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SettingScreen = () => {
    return (
      <View style={styles.container}>
        <View>
          <Text>This page is just for fun</Text>
        </View>
        <Text>Settings Screen</Text>
        <Button
          title="Click Here"
          onPress={() => alert('Button Clicked!')}
        />
      </View>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});