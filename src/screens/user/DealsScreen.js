import React, {useState} from 'react';
import {
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList
} from 'react-native';
import {useFirestoreConnect} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {AddButton, Paper} from "../../components";
import {useTheme} from "react-native-paper";
import ImageView from 'react-native-image-view';

export const DealsScreen = ({navigation}) => {
    
    useFirestoreConnect([{collection:'deals'}]);
    
    const theme = useTheme();
    const deals = useSelector(state=>state.firestore.ordered.deals || []);
    const authUser = useSelector(state=>state.firebase.profile);
    const [images, setImages] = useState([]);
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
        setImages([
            {
                source: {uri: deal.barcode,},
                title: deal.title,
                width: theme.wp('100%'),
                height: theme.hp('100%'),
            }
        ])
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
    
    return (
        <SafeAreaView style={styles.root}>
            <Text style={styles.headText}>OnGoing Deals</Text>
            <FlatList
                data={deals}
                renderItem={renderItem}
                keyExtractor={(item)=>item.id}
            />
            <AddButton show={authUser.role === 'admin'} onPress={addDeal} />
            <ImageView
                images={images}
                imageIndex={0}
                isVisible={visible}
                onClose={handleClose}
                animationType={'none'}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        position: 'relative',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
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
