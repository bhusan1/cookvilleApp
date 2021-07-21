import {DefaultTheme} from 'react-native-paper';
import {Dimensions, Platform} from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const colors = {
    default: '#000000',
    border: '#aaaaaa',
    primary: '#788eec',
    primaryActive: '#e58732',
    primaryOpacity: '#E793473f',
    primaryLight: '#e0b389',
    secondary: '#6e012a',
    lightgray: '#dcdcdc',
    comment: '#808080',
    gray: 'gray',
    lightGrey: '#afafaf',
    ghostwhite: 'ghostwhite',
    danger: '#f52f2f',
    success: '#4caf50',
    btnContinue: '#E79347',
    overlayColor: 'rgba(0,0,0,0.5)',
    bgDark: '#e8e8e8',
    black: '#000000',
    main: '#ff0010',
};

const fontSizes = {
    default: 15,
    normal: 20,
    large: 26,
    extraLarge: hp('3%'),
};

const fonts = {
    black: isIos ? 'OpenSans' : 'OpenSans',
    blackItalic: isIos ? 'OpenSans' : 'OpenSans',
    regular: isIos ? 'OpenSans' : 'OpenSans',
    italic: isIos ? 'OpenSans' : 'OpenSans',
    medium: isIos ? 'OpenSans' : 'OpenSans',
    bold: isIos ? 'OpenSansBold' : 'OpenSansBold',
    boldItalic: isIos ? 'OpenSans' : 'OpenSans',
    semiBold: isIos ? 'OpenSans' : 'OpenSans',
    extraBold: isIos ? 'OpenSans' : 'OpenSans',
    extraLight: isIos ? 'OpenSans' : 'OpenSans',
    light: isIos ? 'OpenSans' : 'OpenSans',
    lightItalic: isIos ? 'OpenSans' : 'OpenSans',
    thinItalic: isIos ? 'OpenSans' : 'OpenSans',
};

const borderRadius = {
    normal: 4,
    large: 8,
    extraLarge: 12,
};

const styles = {
    h1: {
        width:'100%',
        fontSize: fontSizes.extraLarge,
        fontFamily: fonts.bold,
        color: colors.default,
    },
    c1: {
        fontSize: fontSizes.extraLarge,
        fontFamily: fonts.bold,
        color: colors.default,
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    c2: {
        fontSize: hp('2.5%'),
        fontFamily: fonts.bold,
        color: colors.default,
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    h2: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: colors.default,
        width: '100%',
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    h4: {
        fontSize: 18,
        color: colors.default,
        width: '100%',
        marginBottom: 10,
    },
    c4: {
        fontSize: 18,
        color: colors.default,
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    h5: {
        fontSize: 16,
        color: colors.default,
        width: '100%',
        marginBottom: 10,
    },
    c5: {
        fontSize: 16,
        color: colors.default,
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    h6: {
        fontSize: 14,
        color: colors.default,
        width: '100%',
        fontWeight: 'bold',
        marginTop: 10,
    },
    link: {
        fontSize: 18,
        color: colors.primary,
        width: '100%',
        fontWeight: 'bold',
        marginTop: 10,
    },
    lightLink: {
        fontSize: 16,
        color: colors.primary,
        width: '100%',
        marginTop: 10,
    },
    title: {
        fontSize: fontSizes.extraLarge,
        fontFamily: fonts.bold,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: fontSizes.normal,
        fontFamily: fonts.bold,
        textTransform: 'uppercase',
    },
    description: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: fonts.regular,
        color: '#555555',
    },
    comment: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.regular,
        color: colors.comment,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    shadow: {
        shadowColor: '#000000',
        shadowOffset: {
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    overLayer: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#0000003f',
        position: 'absolute',
        left: 0,
        top: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dangerText:{
        fontSize: 18,
        color: colors.danger,
        width: '100%',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    }
};

export default {
    ...DefaultTheme,
    colors,
    fonts,
    fontSizes,
    borderRadius,
    styles,
    isIos,
    isAndroid,
    screenHeight,
    screenWidth,
    wp,
    hp,
};
