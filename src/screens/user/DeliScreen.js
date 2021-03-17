import React from 'react';
import {FlatList, View, Text, Image, StyleSheet, ScrollView, SafeAreaView, StatusBar} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import {AddButton, Paper} from '../../components';

export const DeliScreen = ({navigation}) => {
    useFirestoreConnect([{collection: 'recipes'}]);

    const theme = useTheme();
    const styles = useStyles(theme);

    const authUser = useSelector((state) => state.firebase.profile);
    const recipes = useSelector((state) => state.firestore.ordered.recipes || []);

    const addDeal = () => {
        navigation.navigate('AddDeal');
    };

    const renderItem = ({item}) => (
        <Paper style={styles.itemContainer}>
            <Image style={styles.photo} source={{uri: item.image}} />
            <Text style={styles.title}>{item.title}</Text>
        </Paper>
    );

    return (
        <SafeAreaView style={styles.root}>
            <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={1}
                data={recipes}
                style={{flex: 1, padding: theme.wp('2%')}}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
            />
            <AddButton show={authUser.role === 'admin'} onPress={addDeal} />
        </SafeAreaView>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            marginTop: StatusBar.currentHeight,
            position: 'relative',
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
        },
        photo: {
            width: '100%',
            height: '80%',
            borderRadius: 5,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderStyle:'solid',
            borderWidth: 0.5,
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
            borderTopWidth: 0.5
        },
    });
