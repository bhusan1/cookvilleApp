import {DefaultTheme} from 'react-native-paper';
import {Dimensions, Platform} from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const colors = {
    default: '#000000',
    primary: '#E79347',
    primaryActive: '#e58732',
    primaryOpacity: '#E793473f',
    primaryLight: '#e0b389',
    secondary: '#60c2d4',
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
};

const fontSizes = {
    default: 15,
    normal: 20,
    large: 26,
    extraLarge: hp('3%'),
};

const fonts = {
    black: isIos ? 'Roboto-Black' : 'RobotoBlack',
    blackItalic: isIos ? 'Roboto-BlackItalic' : 'RobotoBlackItalic',
    regular: isIos ? 'Roboto-Regular' : 'RobotoRegular',
    italic: isIos ? 'Roboto-Italic' : 'RobotoItalic',
    medium: isIos ? 'Roboto-Medium' : 'RobotoMedium',
    bold: isIos ? 'Roboto-Bold' : 'RobotoBold',
    boldItalic: isIos ? 'Roboto-BoldItalic' : 'RobotoBoldItalic',
    semiBold: isIos ? 'Roboto-Medium' : 'RobotoMedium',
    extraBold: isIos ? 'Roboto-Bold' : 'RobotoBold',
    extraLight: isIos ? 'Roboto-BoldItalic' : 'RobotoBoldItalic',
    light: isIos ? 'Roboto-Light' : 'RobotoLight',
    lightItalic: isIos ? 'Roboto-LightItalic' : 'RobotoLightItalic',
    thinItalic: isIos ? 'Roboto-ThinItalic' : 'RobotoThinItalic',
};

const borderRadius = {
    normal: 4,
    large: 8,
    extraLarge: 12,
};

const styles = {
    h1: {
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
        elevation: 8,
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