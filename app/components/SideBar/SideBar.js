import React, { Component } from 'react'
import {
    Linking,
    Text,
    TextInput,
    View
} from 'react-native'
import {
    Container,
    Icon,
    Button,
} from 'native-base'

import FontAwesome, { Icons } from 'react-native-fontawesome'

import styles from './styles'

export default class SideBar extends React.Component {
    render() {
        return (
            <Container style={{
                backgroundColor: '#2E3235',
            }}>
                    <View style={styles.sideNavWrap}>
                        <Text style={styles.appName}>Boostnote Mobile</Text>
                        <Button onPress={() => {
                            this.props.changeMode(0)
                            this.props.onClose()
                        }}>
                            <Text style={styles.noteSelector}><Icon name='md-archive' style={{color: '#FDC134', fontSize: 14}}/> All Notes</Text>
                        </Button>
                        <View style={styles.hariboteWrap}>
                        <Text style={styles.noteHaribote}>Folders</Text>
                        <Text style={styles.hariboteDesc}>Under development.</Text>
                        </View>
                        <View>
                            <Button onPress={() => {
                                this.props.changeMode(1)
                                this.props.onClose()
                            }}>
                                <FontAwesome style={{fontSize: 16}}>{Icons.dropbox}</FontAwesome>
                                <Text>Dropbox</Text>
                            </Button>
                        </View>
                    </View>

                    <View style={styles.bottomLink}>
                        <Text onPress={() => Linking.openURL('https://boostnote.io/')} style={styles.bottomLinkWord}>
                            <Icon style={{fontSize: 16,  color: '#89888d'}} name='link'/> Boostnote app for Desktop
                        </Text>
                    </View>
            </Container>
        )
    }
}
