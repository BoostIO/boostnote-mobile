import React, { Component } from 'react'
import {
    Linking,
    Text,
    View
} from 'react-native'
import {
    Container,
    Icon
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
                        <Text style={styles.noteSelector}><Icon name='md-archive' style={{color: '#FDC134', fontSize: 14}}/> All Notes</Text>
                        <View style={styles.hariboteWrap}>
                            <Text style={styles.noteHaribote}>Folders</Text>
                            <Text style={styles.hariboteDesc}>Under development.</Text>
                        </View>
                        <View>
                            <Text style={styles.noteHaribote}><FontAwesome style={{fontSize: 16}}>{Icons.dropbox}</FontAwesome> Dropbox</Text>
                            <Text style={styles.hariboteDesc}>Will be released in September.</Text>
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
