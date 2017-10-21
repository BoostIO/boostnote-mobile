import React, { Component } from 'react'
import {
    Linking,
    Text,
    TextInput,
    View,
    Platform,
} from 'react-native'
import {
    Container,
    Icon,
    Button,
} from 'native-base'

import styles from './styles'

export default class SideBar extends React.Component {
    render() {
        return (
            <Container style={{backgroundColor: '#2E3235'}}>
                    <View style={styles.sideNavWrap}>
                        <View style={styles.noteSelectorWrap}>
                            <Text style={styles.appName}>Boostnote Mobile</Text>
                            <Button style={Platform.OS === 'android' ? {marginBottom: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', width: '96%', height: 35, paddingTop: 6, paddingLeft: 7} : {backgroundColor: 'transparent', paddingLeft: 0}}
                                onPress={() => {
                                    this.props.changeMode(0)
                                    this.props.onClose()
                                }}
                            >
                                <Text style={Platform.OS === 'android' ? styles.noteSelectorAndroid : styles.noteSelector}><Icon name='md-archive' style={{color: '#FDC134', fontSize: 14, backgroundColor: 'transparent'}}/> All Notes</Text>
                            </Button>
                        </View>

                        <View style={styles.noteSelectorWrap}>
                            <Button style={Platform.OS === 'android' ? {marginBottom: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', width: '96%', height: 35, paddingTop: 6, paddingLeft: 7} : {backgroundColor: 'transparent', paddingLeft: 0}}
                                onPress={() => {
                                    this.props.changeMode(1)
                                    this.props.onClose()
                                }}
                            >
                                <Text  style={Platform.OS === 'android' ? styles.noteSelectorAndroid : styles.noteSelector}><Icon name='logo-dropbox' style={{color: '#2BA6FA', fontSize: 18, backgroundColor: 'transparent'}}/> Dropbox</Text>
                            </Button>
                        </View>

                        {/* <View style={styles.hariboteWrap}>
                            <Text style={styles.noteHaribote}>Folders</Text>
                            <Text style={styles.hariboteDesc}>Under development.</Text>
                        </View> */}

                    </View>

                    <View style={styles.bottomLink}>
                        <Text onPress={() => Linking.openURL('https://github.com/BoostIO/Boostnote-mobile')} style={styles.bottomLinkWord}>
                            <Icon style={{fontSize: 16,  color: '#89888d'}} name='logo-github'/> Boostnote Mobile is Open Source
                        </Text>
                    </View>
            </Container>
        )
    }
}
