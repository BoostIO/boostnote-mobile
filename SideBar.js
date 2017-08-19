import React, { Component } from 'react';
import { Text, View } from 'react-native'
import {
    Container,
    List,
    ListItem,
    Icon
} from 'native-base';

import FontAwesome, { Icons } from 'react-native-fontawesome';

const styles = {
    sideNavWrap: {
        top: 60,
        marginLeft: 20,
    },
    appName: {
        fontSize: 24,
        color: '#89888d',
        marginBottom: 40
    },
    noteSelector: {
        fontSize: 18,
        color: '#3a3941',
        marginBottom: 40,
        backgroundColor: 'rgba(217, 217, 217, 0.5)',
        width: '90%',
        height: 35,
        borderRadius: 6,
        paddingTop: 6,
        paddingLeft: 7
    },
    hariboteWrap: {
        marginBottom: 50
    },
    noteHaribote: {
        fontSize: 21,
        color: '#89888d',
        marginBottom: 5
    },
    hariboteDesc: {
        fontSize: 12,
        fontWeight: '600',
        color: '#89888d'
    }
}

export default class SideBar extends React.Component {
    render() {
        return (
            <Container style={{
                backgroundColor: 'white',
            }}>
                    <View style={styles.sideNavWrap}>
                        <Text style={styles.appName}>Boostnote Mobile</Text>
                        <Text style={styles.noteSelector}><FontAwesome style={{color: '#be3a31', fontSize: 16}}>{Icons.archive}</FontAwesome> All Notes</Text>
                        <View style={styles.hariboteWrap}>
                            <Text style={styles.noteHaribote}>Folders</Text>
                            <Text style={styles.hariboteDesc}>Under development.</Text>
                        </View>
                        <View>
                            <Text style={styles.noteHaribote}><FontAwesome style={{fontSize: 16}}>{Icons.dropbox}</FontAwesome> Dropbox</Text>
                            <Text style={styles.hariboteDesc}>Will released in mid of September.</Text>
                        </View>
                    </View>
                    <List style={{
                        flex:1,
                        top: 50,
                    }}>
                        {/*<ListItem>
                            <Text>Boostnote mobile</Text>
                        </ListItem>
                        <ListItem>
                            <Text>All notes</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Starred</Text>
                        </ListItem>
                        <ListItem>
                            <Text>My storage</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Aaaaa</Text>
                        </ListItem>
                        <ListItem>
                            <Text>bbbbb</Text>
                        </ListItem>*/}
                    </List>
            </Container>
        );
    }
}
