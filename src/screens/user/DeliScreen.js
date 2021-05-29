import React, {useEffect, useState} from 'react';
import {
    FlatList,
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    Alert,
    TouchableOpacity, StatusBar
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from 'react-native-paper';
import {useFirestore, useFirestoreConnect} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import {AddButton, Paper} from '../../components';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DeliDetailModal} from "../../components/modal/DeliDetailModal";
import {CheckOutModal} from "../../components/modal/CheckOutModal";

export const DeliScreen = ({navigation}) => {

    useFirestoreConnect([{collection: 'recipes'}]);

    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const styles = useStyles(theme);
    const firestore = useFirestore();
    const [selectedDeli, setSelectedDeli] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    const authUser = useSelector((state) => state.firebase.profile);
    const recipes = useSelector((state) => state.firestore.ordered.recipes || []);
    const cart = useSelector(state=>state.auth.cart);
    const readyTime = useSelector((state)=>state.auth.readyTime);

    useEffect(()=>{
        setTimeout(()=>{
            setCurrentTime(new Date().getTime());
        }, 1000)
    },[currentTime])

    const addDeal = () => {
        navigation.navigate('AddRecipe');
    };

    const onCloseDetailModal = () => {
        setOpenDetailModal(false);
    }

    const onCloseCheckoutModal = () => {
        setOpenCheckoutModal(false);
    }

    const handleCheckoutPress = () => {
        if(cart.totalCount){
            setOpenCheckoutModal(true);
        }
    }

    const renderItem = ({item}) => (
        <Paper
            style={styles.itemContainer}
            onPress={()=>{
                if(authUser.role === 'admin'){
                    navigation.navigate('AddRecipe',{deli: item});
                } else {
                    if(!(readyTime && (readyTime > currentTime))){
                        setSelectedDeli(item);
                        setOpenDetailModal(true);
                    }
                }
            }}
        >
            {
                authUser.role === 'admin' &&
                <TouchableOpacity style={styles.dealRemove} onPress={()=>{removeDeal(item.id)}}>
                    <SimpleLineIcons name={'close'} size={16} color={theme.colors.danger}/>
                </TouchableOpacity>
            }
            <Image style={styles.photo} source={{uri: item.image}} />
            <View style={{position:'relative', flexDirection:'row', width:'100%'}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={{position:'absolute', right: 10, top: 6}}>${item.price || 5}</Text>
            </View>
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
            <StatusBar barStyle={'light-content'}/>
            <View style={[styles.statusBar, {height: insets.top}]}/>
            <View style={styles.header}>
                <Text style={styles.headText}>Today's Special</Text>
                <TouchableOpacity style={styles.cartIcon} onPress={handleCheckoutPress}>
                    <View style={{position:'relative'}}>
                        {
                            cart.totalCount > 0 &&
                            <View style={styles.totalCount}>
                                <Text style={{color:'white', fontSize:12, fontWeight:'600'}}>{cart.totalCount}</Text>
                            </View>
                        }
                        <MaterialIcons name={'shopping-cart'} color={'white'} size={theme.hp('3%')}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    data={recipes}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.id}`}
                />
                {
                    cart.totalCount > 0 &&
                    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckoutPress}>
                        <Text style={{color:'white', fontSize: 24, fontWeight:'700'}}>Pay at Store</Text>
                    </TouchableOpacity>
                }
            </View>
            <AddButton show={authUser.role === 'admin'} onPress={addDeal} />
            <DeliDetailModal deli={selectedDeli} open={openDetailModal} onClose={onCloseDetailModal}/>
            <CheckOutModal open={openCheckoutModal} onClose={onCloseCheckoutModal} />
            {
                readyTime && (readyTime > currentTime) &&
                <View style={styles.orderPreparing}>
                    <Text style={{color:'white', fontSize: 14}}>
                        Your order is being prepared -
                        {new Date(readyTime - currentTime).getMinutes()} min
                        {new Date(readyTime - currentTime).getSeconds()} sec
                    </Text>
                </View>
            }
        </SafeAreaView>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            flex: 1,
            position: 'relative',
        },
        statusBar:{
            position:'absolute',
            top: 0,
            width:'100%',
            backgroundColor:'#6e012a'
        },
        totalCount:{
            position:'absolute',
            top: -10,
            right: -4,
            zIndex: 10,
            backgroundColor:'#6e012a',
            width: 16,
            height: 16,
            borderRadius: 8,
            justifyContent:'center',
            alignItems:'center'
        },
        headText: {
            fontSize: theme.hp('2.8%'),
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 20,
            color:'white',
        },
        header:{
            width:'100%',
            height: theme.hp('10%'),
            backgroundColor:'#87ceeb',
            justifyContent:'center',
            alignItems:'center',
            position:'relative',
        },
        header2:{
            width:'100%',
            height: theme.hp('40%'),
            backgroundColor:'#87ceeb',
            justifyContent:'center',
            alignItems:'center',
            position:'relative',
        },
        cartIcon: {
            position:'absolute',
            right: theme.wp('5%'),
            top: theme.hp('3.7%'),
        },
        content:{
            flex: 1,
            padding: theme.wp('2.5%'),
            position:'relative'
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
        checkoutButton:{
            width: theme.wp('90%'),
            height: 50,
            backgroundColor:'#87ceeb',
            borderRadius: 4,
            alignSelf:'center',
            justifyContent:'center',
            alignItems:'center',
            marginTop: theme.hp('2%'),
        },
        orderPreparing:{
            backgroundColor:'#87ceeb',
            width:'100%',
            padding: theme.wp('5%'),
            alignItems:'center',
            justifyContent:'center',
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
            paddingTop: 4,
        },
    });
