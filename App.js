import React, {useEffect, useState} from 'react';
import 'react-native-get-random-values'
import * as Font from 'expo-font';
import MainApp from './src/App';

import {decode, encode} from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export default function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                OpenSans: require('./src/assets/fonts/OpenSans-Regular.ttf'),
                OpenSansBold: require('./src/assets/fonts/OpenSans-Bold.ttf'),
            });
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return null;
    }

    return <MainApp />;
}
