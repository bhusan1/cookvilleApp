import React from 'react';
import  MainApp  from './src/app';

import {decode, encode} from 'base-64';

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default function App() {
    return (<MainApp />);
}
