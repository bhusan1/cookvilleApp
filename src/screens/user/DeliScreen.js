import React from 'react';
import {
    FlatList,
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    Alert,
    TouchableOpacity
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useFirestore, useFirestoreConnect} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import {AddButton, Paper} from '../../components';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

export const DeliScreen = ({navigation}) => {
    
    useFirestoreConnect([{collection: 'recipes'}]);

    const theme = useTheme();
    const styles = useStyles(theme);
    const firestore = useFirestore();

    const authUser = useSelector((state) => state.firebase.profile);
    const recipes = useSelector((state) => state.firestore.ordered.recipes || []);

    const addDeal = () => {
        navigation.navigate('AddRecipe');
    };

    const renderItem = ({item}) => (
        <Paper style={styles.itemContainer}>
            {
                authUser.role === 'admin' &&
                <TouchableOpacity style={styles.dealRemove} onPress={()=>{removeDeal(item.id)}}>
                    <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                </TouchableOpacity>
            }
            <Image style={styles.photo} source={{uri: item.image}} />
            <Text style={styles.title}>{item.title}</Text>
        </Paper>
    );
    
    const removeDeal = (dealId) => {
        Alert.alert(
            'Confirm',
            'Do you really want to delete it?',
            [
                {
                    text:'Cancel',
                    style:'cancel'
                },
                {
                    text:'Delete',
                    onPress:async ()=>{
                        await firestore.collection('recipes').doc(dealId).delete();
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.content}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    data={recipes}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}`}
                />
            </View>
            <AddButton show={authUser.role === 'admin'} onPress={addDeal} />
        </SafeAreaView>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            position: 'relative',
        },
        content:{
            flex: 1,
            padding: theme.wp('2.5%')
        },
        dealRemove:{
            position:'absolute',
            top: 0,
            right: 0,
            width: 30,
            height: 30,
            zIndex: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        itemContainer: {
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: theme.hp('1%'),
            width: '100%',
            padding: 0,
            height: theme.hp('30%'),
            borderColor: '#cccccc',
            borderWidth: 0.5,
            borderRadius: 15,
            overflow: 'hidden',
            position: 'relative',
        },
        photo: {
            width: '100%',
            height: '85%',
            borderRadius: 5,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            resizeMode:'cover',
        },
        title: {
            fontSize: 17,
            width:'100%',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#444444',
            marginRight: 5,
            marginLeft: 5,
            borderStyle:'solid',
            borderTopWidth: 0.5,
            height:'15%'
        },
    });
