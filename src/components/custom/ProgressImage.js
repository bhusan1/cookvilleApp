import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

export const ProgressImage = ({style = {}, source, imageStyle = {}}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    
    const [visible, setVisible] = useState(true);
    const [isError, setIsError] = useState(false);
    const viewAnimation = useRef(null);
    
    useEffect(() => {
        if (viewAnimation) {
            (async () => {
                await viewAnimation.current.bounceIn(3000);
            })();
        }
    }, [viewAnimation]);
    
    const _loadEnd = () => {
        setVisible(false);
        setImageSize({width: '100%', height: '100%'});
    };
    
    const _onError = () => {
        setIsError(true)
    }
    
    return (
        <View style={[styles.root, style]}>
            {visible && (
                <Animatable.View ref={viewAnimation} style={[styles.animatableImage, imageStyle]}>
                    <ActivityIndicator />
                </Animatable.View>
            )}
            <FastImage source={source} style={[styles.image, imageStyle, imageSize]} onLoadEnd={_loadEnd} onError={_onError}/>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        root: {
            height: '100%',
            width: '100%',
        },
        image: {
            resizeMode: 'cover',
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: '#8080807f',
            position: 'relative',
        },
        animatableImage: {
            width: '100%',
            height: '100%',
            borderRadius: 5,
            backgroundColor: 'rgba(7,19,4, 0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
