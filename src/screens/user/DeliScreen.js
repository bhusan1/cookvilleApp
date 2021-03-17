import React from 'react';
import { FlatList,View, Text,Image, StyleSheet} from 'react-native';
import { recipes } from '../../data/dataArrays';
import {useTheme} from "react-native-paper";


export const DeliScreen = ({navigation}) => {

    const theme = useTheme();
    const styles = useStyles(theme)
    
  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <Image style={styles.photo} source={{ uri: item.photo_url }}/>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

    return(
      <View>
        <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={recipes}
        renderItem={renderItem}
        keyExtractor={item => `${item.recipeId}`}
        />
      </View>
    )
}


const useStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 20,
        marginTop: 20,
        width: theme.wp('40%'),
        height: 225,
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15
    },
    photo: {
        width: theme.wp('40%'),
        height: 150,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    title: {
        flex: 1,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
    },
});












