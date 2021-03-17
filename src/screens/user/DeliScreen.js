import React from 'react';
import { FlatList,View, Text,Image, StyleSheet} from 'react-native';
import {useTheme} from "react-native-paper";
import {useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {Paper} from '../../components'


export const DeliScreen = () => {
    
    useFirestoreConnect([{collection:'recipes'}])
    
    const theme = useTheme();
    const styles = useStyles(theme)
    
    const recipes = useSelector(state=> state.firestore.ordered.recipes || []);
    
    const renderItem = ({ item }) => (
        <Paper style={styles.itemContainer}>
          <Image style={styles.photo} source={{ uri: item.photo_url }}/>
          <Text style={styles.title}>{item.title}</Text>
        </Paper>
    );

    return(
        <View>
            <FlatList
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
    itemContainer: {
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
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444444',
        marginTop: 3,
        marginRight: 5,
        marginLeft: 5,
    },
});












