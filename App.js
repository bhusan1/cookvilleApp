import React, {useEffect, useState} from 'react';
import 'react-native-get-random-values'
import MainApp from './src/App';

import {decode, encode} from 'base-64';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

export default function App() {
    return <MainApp />;
}
