import React, { Component } from 'react';
import { Linking, Text, View } from 'react-native'
import {
    Container,
    Icon
} from 'native-base';

import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = {
    sideNavWrap: {
        top: 60,
        marginLeft: 20,
    },
    appName: {
        fontSize: 21,
        color: '#CECFCE',
        marginBottom: 40
    },
    noteSelector: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 40,
        backgroundColor: '#414747',
        width: '90%',
        height: 35,
        paddingTop: 6,
        paddingLeft: 7
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
        paddingBottom: 10
    },
    bottomLinkWord: {
        fontSize: 14,
        color: 'rgba(206,207,206,0.8)',
        fontWeight: '600'
    },
}

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
        );
    }
}
