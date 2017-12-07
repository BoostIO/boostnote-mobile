import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    sideNavWrap: {
        top: 60,
        marginLeft: 20,
    },
    appName: {
        fontSize: 21,
        color: '#CECFCE',
        marginBottom: 40
    },
    noteSelectorWrap: {
        marginBottom: 10,
    },
    noteSelector: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        width: '96%',
        height: 35,
        paddingTop: 6,
        paddingLeft: 7
    },
    noteSelectorAndroid: {
        fontSize: 18,
        color: '#ffffff',
    },
    hariboteWrap: {
        marginBottom: 50
    },
    noteHaribote: {
        fontSize: 18,
        color: '#CECFCE',
        marginBottom: 5
    },
    hariboteDesc: {
        fontSize: 14,
        color: 'rgba(206,207,206,0.8)'
    },
    bottomLink: {
        position: 'absolute',
        bottom: 0,
        marginLeft: 15,
        paddingBottom: 10,
        flex: 1,
        flexDirection: 'row'
    },
    bottomLinkWord: {
        fontSize: 14,
        flex: 1,
        color: 'rgba(206,207,206,0.8)',
        fontWeight: '600',
    },
})