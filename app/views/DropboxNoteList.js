import React, {Component} from 'react'

import {
    Text,
    View,
    AsyncStorage,
    ActivityIndicator,
    Linking,
} from 'react-native'

import {
    Body,
    Card,
    Icon,
    CardItem,
    Button,
} from 'native-base'

import moment from 'moment'

import DropboxLinkModal from './DropboxLinkModal'
import ReadOnlyNoteModal from './ReadOnlyNoteModal'

import CoffeeScript from 'coffeescript/lib/coffeescript/browser'

const DROPBOX_ACCESS_TOKEN = 'DROPBOX:ACCESS_TOKEN'

const styles = {
    noteListWrap: {
        marginTop: 0,
        marginBottom: 0,
        borderColor: '#F7F7F7',
        borderBottomWidth: 1
    },
    noteList: {
        width: '100%',
        height: 65,
        backgroundColor: 'rgba(244,244,244,0.1)',
    },
    iosHeader: {
        backgroundColor: '#239F85',
    },
    androidHeader: {
        backgroundColor: '#29BB9C',
        height: 70
    },
    appName: {
        color: '#ffffff',
        fontSize: 24,
        marginTop: 8,
        fontWeight: '300'
    },
    headerMenuButton: {
        color: '#ffffff',
        fontSize: 24,
        marginRight: 30
    },
    headerRightMenuButton: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 21,
        marginRight: 20
    },
    noteListIconWrap: {
        backgroundColor: '#eeeeee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 50,
        overflow: 'hidden',
        marginTop: 9
    },
    noteListIcon: {
        fontSize: 14,
        color: '#adadad'
    },
    noteListText: {
        position: 'absolute',
        color: '#3a3941',
        backgroundColor: 'transparent',
        top: 15,
        fontSize: 14,
        width: '73%',
        marginLeft: 40
    },
    noteListTextNone: {
        position: 'absolute',
        color: '#adadad',
        backgroundColor: 'transparent',
        top: 15,
        fontSize: 14,
        width: '90%',
        marginLeft: 40
    },
    newPostButtonWrap: {
        position: 'absolute',
        marginLeft: '43%',
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 50,
        shadowOffset:{
            width: 0,
            height: 3,
        },
        shadowColor: '#CF5425',
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    noteListDate: {
        position: 'absolute',
        color: 'rgba(40,44,52,0.4)',
        fontSize: 13,
        top: 15,
        right: 0,
        fontWeight: '600'
    },
    newPostButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D15419',
        width: 60,
        height: 60,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
    }
}

export default class DropboxNoteList extends Component {

    constructor() {
        super()
        this.state = {
            noteList: [],
            note: '',
            isWebViewOpen: false,
            isNoteOpen: false,
            isLoading: false,
            isConnectedToDropbox: false,
            isNotConnectedToBoostnote: false
        }
    }

    componentDidMount() {
        this.getToken()
    }

    setIsWebViewOpen(isOpen) {
        this.setState({
            isWebViewOpen: isOpen
        })
    }

    getToken() {
        AsyncStorage.getItem(DROPBOX_ACCESS_TOKEN)
            .then((value) => {
                if (value == null) {
                    // open webview to sign in Dropbox
                    this.setIsWebViewOpen(true)
                } else {
                    this.setState({
                        isConnectedToDropbox: true
                    })
                    this.getDropboxNoteData(value)
                }
            })
            .catch((e) => {
                // open webview to sign in Dropbox
                this.setIsWebViewOpen(true)
            })
    }

    getDropboxNoteData(token) {
        this.setState({
            noteList: [],
            isLoading: true
        })
        fetch('https://api.dropboxapi.com/2/files/list_folder', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: '/notes',
                recursive: false,
                include_media_info: false,
                include_deleted: false,
                include_has_explicit_shared_members: false,
                include_mounted_folders: false,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let noteList = [];

                if (responseJson.error_summary && responseJson.error_summary.startsWith('path/not_found/')) {
                    this.setState({
                        isNotConnectedToBoostnote: true
                    })
                }
                if (!responseJson.entries || responseJson.entries.length === 0) {
                    this.setState({
                        isLoading: false,
                    })
                    return
                }
                responseJson.entries.map(entry => {
                    if (!entry.name.endsWith('.cson')) {
                        // Do nothing
                        // Parse cson file only now
                        this.setState({
                            isLoading: false,
                        })
                        return
                    }
                    fetch('https://content.dropboxapi.com/2/files/download', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Dropbox-API-Arg': `{"path":  "${entry.path_display}"}`,
                        }})
                        .then((response) => {
                            return response.text()
                        })
                        .then((responseCson) => {
                            this.setState({
                                isLoading: false,
                            })

                            const response = CoffeeScript.eval(responseCson)
                            if (response.type !== 'MARKDOWN_NOTE' || response.isTrashed) {
                                // Do nothing
                                // Parse not trashed markdown only now
                                return
                            }

                            noteList.push({
                                fileName: entry.name,
                                content: response.content,
                                createdAt: response.createdAt,
                            })

                            noteList.sort((a, b) => {
                                return a.createdAt < b.createdAt ? 1 : -1
                            })

                            this.setState({
                                noteList: noteList
                            })
                        })
                        .catch((error) => {
                            this.setState({
                                isLoading: false,
                            })
                            console.log(error)
                        })
                })
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                })
                console.log(error)
            })
    }

    setNoteModalOpen(content) {
        this.setState({
            content: content,
            isNoteOpen: true,
        })
    }

    setNoteModalClose() {
        this.setState({
            isNoteOpen: false,
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {
                    // Show refresh button when not loading when...
                    // 1. Connected to Dropbox.
                    // 2. Connected to Boostnote.
                    // 3. Not loading.
                    this.state.isConnectedToDropbox && !this.state.isNotConnectedToBoostnote && !this.state.isLoading ?
                        <Button
                            transparent
                            onPress={() => this.getToken()}>
                            <View style={styles.newPostButton}>
                                <Icon name='md-refresh' style={{color: "#fff"}}/>
                            </View>
                        </Button>
                        : null
                }
                <ActivityIndicator animating={this.state.isLoading}/>
                {
                    // Show Dropbox connect button when...
                    // 1. Not connected to Dropbox.
                    // 2. Not loading.
                    !this.state.isConnectedToDropbox && !this.state.isLoading ?
                        <Button onPress={() => this.setIsWebViewOpen(true)}>
                            <Text>Tap here to sign in Dropbox!</Text>
                        </Button>
                        : null
                }
                {
                    // Show link of how to blog post when...
                    // 1. Connected to Dropbox.
                    // 2. Not connected to Boostnote.
                    // 3. Not loading.
                    this.state.isConnectedToDropbox && this.state.isNotConnectedToBoostnote && !this.state.isLoading ?
                        <Text onPress={() => Linking.openURL('https://boostnote.io/')} style={styles.bottomLinkWord}>
                            <Icon style={{fontSize: 16,  color: '#89888d'}} name='link'/> Create note in Boostnote Desktop!
                        </Text>
                        : null
                }
                {
                    this.state.noteList.map((note) => {
                        return <Card transparent key={note.fileName} style={styles.noteListWrap}>
                            <CardItem
                                style={styles.noteList}
                                button onPress={() => this.setNoteModalOpen(note.content)}>
                                <Body>
                                <View style={styles.noteListIconWrap}>
                                    <Icon name='md-code-working' style={styles.noteListIcon}/>
                                </View>
                                <Text numberOfLines={1}
                                      style={styles.noteListText}>{note.content}</Text>
                                <Text style={styles.noteListDate}>{moment(note.createdAt).format('MMM D')}</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    })
                }
                <DropboxLinkModal
                    isWebViewOpen={this.state.isWebViewOpen}
                    setIsWebViewOpen={this.setIsWebViewOpen.bind(this)}
                    onGetTokenSuccess={this.getToken.bind(this)}
                />
                <ReadOnlyNoteModal setNoteModalClose={this.setNoteModalClose.bind(this)}
                                   isNoteOpen={this.state.isNoteOpen}
                                   content={this.state.content}/>
            </View>
        )
    }
}