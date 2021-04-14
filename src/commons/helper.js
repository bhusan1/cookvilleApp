import {Alert} from 'react-native';

const mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validate = (data, rules, showAlert = true) => {
    for (let key in rules) {
        let ruleItems = rules[key].split('|');
        for (let ruleItem of ruleItems) {
            if (ruleItem === 'required' && !data[key]) {
                if (showAlert) {
                    Alert.alert('Warning', key + ' is required');
                }
                return false;
            }

            if (ruleItem === 'email' && !mailFormat.test(data[key].toString().toLowerCase())) {
                if (showAlert) {
                    Alert.alert('Warning', key + ' should be valid email');
                }
                return false;
            }

            if (ruleItem.split(':')[0] === 'min') {
                if (data[key].length < parseInt(ruleItem.split(':')[1])) {
                    if (showAlert) {
                        Alert.alert('Warning', key + ' should be more than ' + ruleItem.split(':')[1] + 'characters');
                    }
                    return false;
                }
            }

            if (ruleItem.split(':')[0] === 'length') {
                if (data[key].length !== parseInt(ruleItem.split(':')[1])) {
                    if (showAlert) {
                        Alert.alert('Warning', key + ' should be ' + ruleItem.split(':')[1] + 'characters');
                    }
                    return false;
                }
            }

            if (ruleItem.split(':')[0] === 'same') {
                if (data[key] !== data[ruleItem.split(':')[1]]) {
                    if (showAlert) {
                        Alert.alert('Warning', key + ' should be same with ' + ruleItem.split(':')[1]);
                    }
                    return false;
                }
            }
        }
    }

    return true;
};
