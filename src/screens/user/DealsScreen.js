import React, {useState} from 'react';
import {
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    View,
    FlatList,
    StatusBar,
} from 'react-native';
import {useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {AddButton, Paper} from "../../components";
import {useTheme} from "react-native-paper";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { useSafeAreaInsets } from 'react-native-safe-area-context';
export const DealsScreen = ({navigation}) => {

    useFirestoreConnect([{collection:'deals'}]);
    const insets = useSafeAreaInsets();

    const theme = useTheme();
    const styles = useStyles(theme);
    const deals = useSelector(state=>state.firestore.ordered.deals || []);
    const authUser = useSelector(state=>state.firebase.profile);
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(false);

    const addDeal = () => {
        navigation.navigate('AddDeal');
    }

    const viewDeal = (deal) => {
        if(authUser.role === 'admin'){
            navigation.navigate('AddDeal', {deal})
        }
    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleBarcodeClick = (deal)=>{
        setVisible(true);
        setImage({uri: deal.barcode})
    }

    const renderItem = ({item}) => {

        return (
            <Paper style={styles.saCon}>
                <TouchableOpacity activeOpacity={0.8} style={styles.Btn} onPress={()=>{viewDeal(item)}}>
                    <Text style={styles.gasText}>{item.title}</Text>
                    <Text style={styles.dealsText}> {item.description} </Text>
                    <Text style={styles.dateText}> Offer ends {item.deadline} </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '30%', borderColor: theme.colors.border, borderWidth: 0.5}} onPress={()=>{handleBarcodeClick(item)}}>
                    <Image source={{uri: item.barcode}} style={{width: '100%', height: 100, resizeMode:'cover'}} />
                </TouchableOpacity>
            </Paper>
        )
    }

    if(authUser.isEmpty){
        return  null;
    }

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle={'light-content'}/>
            <View style={[styles.statusBar, {height: insets.top}]}/>
            <View style={styles.header}>
                <Text style={styles.headText}>Deals & Discounts</Text>
            </View>
            <FlatList
                data={deals}
                renderItem={renderItem}
                keyExtractor={(item)=>item.id}
            />
            <AddButton show={authUser.role === 'admin'} onPress={addDeal} />
            {
                visible &&
                <View style={styles.fullScreenView}>
                    <TouchableOpacity style={styles.closeFullScreen} onPress={()=>{setVisible(false)}}>
                        <SimpleLineIcons name={'close'} size={theme.wp('6%')} color={theme.colors.danger}/>
                    </TouchableOpacity>
                    <Image source={image} style={styles.fullImage}/>
                </View>
            }
        </SafeAreaView>
    );
};


const useStyles = theme => StyleSheet.create({
    root: {
        flex: 1,
        position: 'relative',
    },
    statusBar:{
        position:'absolute',
        top: 0,
        width:'100%',
        backgroundColor:theme.colors.main,
    },
    header:{
        width:'100%',
        height: theme.hp('10%'),
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        borderColor: theme.colors.main,
        borderWidth: 10,
        borderBottomRightRadius: theme.wp('5%'),
        borderBottomLeftRadius: theme.wp('5%'),
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenView:{
        position: 'absolute',
        width: theme.wp('100%'),
        height: theme.hp('100%'),
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        zIndex: 2000,
        elevation: 10,
    },
    fullImage:{
        width:'100%',
        height: theme.hp('20%'),
        resizeMode:'contain',
    },
    closeFullScreen:{
        position:'absolute',
        top: theme.hp('5%'),
        right: theme.wp('2.5%'),
        width: theme.wp('10%'),
        height: theme.wp('10%'),
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headText: {
        fontSize: theme.hp('2.8%'),
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        color:'black',
    },
    divider: {
        paddingTop: 2,
    },
    saCon: {
        backgroundColor: '#fff',
        width: '95%',
        marginVertical: 10,
    },
    gasText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dealsText: {
        fontSize: 15,
        color: 'black',
        paddingVertical: 3,
    },
    dateText: {
        fontSize: 12,
        color: 'black',
    },

    Btn: {
        width: '70%',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    text: {
        fontSize: 17,
        color: 'black',
        padding: 10,
    },
});
