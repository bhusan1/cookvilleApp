import React from 'react';
import { FlatList,View, Text,Image, ScrollView } from 'react-native';
import styles from './DeliStyles';
import { recipes } from '../../data/dataArrays';


export default class DeliScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Deli',
  });

  constructor(props) {
    super(props);
  }

  getMenu = ({ item }) => (
    <View style={styles.container}>
      <Image style={styles.photo} source={{ uri: item.photo_url }}/>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  render() {
    return(
      <View>
        <FlatList 
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={recipes}
        renderItem={this.getMenu}
        keyExtractor={item => `${item.recipeId}`}
        />
      </View>
    )

  }
}


















