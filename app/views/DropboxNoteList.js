import React, {Component} from 'react'

import {
  Text,
  TextInput,
  View,
  Alert,
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
  Container,
  Content
} from 'native-base'

import moment from 'moment'

import CoffeeScript from '../lib/CofeeScriptEval'

import settings from '../config/settings'

import DropboxNoteModal from './note/DropboxNoteModal'

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
  refreshButtonWrap: {
    position: 'absolute',
    right: 30,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 50,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#CF5425',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D15419',
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
  },
  noteListDate: {
    position: 'absolute',
    color: 'rgba(40,44,52,0.4)',
    fontSize: 13,
    top: 15,
    right: 0,
    fontWeight: '600'
  },
  dropboxLinkButtonWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropboxLinkButton: {
    backgroundColor: '#F3F4F4',
    height: 40,
    width: 300,
  },
  dropboxLinkButtonText: {
    color: '#262626',
    fontWeight: '600',
    fontSize: 14,
    textAlignVertical: 'center'
  }
}

export default class DropboxNoteList extends Component {

  constructor() {
    super()
    this.state = {
      folderList: {},
      noteList: [],
      note: '',
      isNoteOpen: false,
      isLoading: false,
      isConnectedToDropbox: false,
      isNotConnectedToBoostnote: false,
      code: '',
    }
  }

  componentDidMount() {
    this.getToken()
  }

  getToken() {
    AsyncStorage.getItem(DROPBOX_ACCESS_TOKEN)
      .then((value) => {
        if (value === null) {
          this.setState({
            isConnectedToDropbox: false
          })
        } else {
          this.setState({
            isConnectedToDropbox: true
          })
          this.getDropboxNoteData(value)
        }
      })
      .catch((e) => {
        this.setState({
          isConnectedToDropbox: false
        })
      })
  }

  getDropboxNoteData(token) {
    this.setState({
      noteList: [],
      isLoading: true
    })

    // Download folder data
    fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Dropbox-API-Arg': `{"path":  "/boostnote.json"}`,
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        this.setState({
          folderList: responseJson.folders
        })
      })

      // Download note list data
      .then(() => {
        return fetch('https://api.dropboxapi.com/2/files/list_folder', {
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

        this.state.folderList.forEach((folder) => {
          noteList.push({
            folderKey: folder.key,
            folderName: folder.name,
            notes: []
          })
        })
        responseJson.entries.forEach(entry => {
          if (!entry.name.endsWith('.cson')) {
            // Do nothing
            // Parse cson file only now
            this.setState({
              isLoading: false,
            })
            return
          }

          // Download each note data
          fetch('https://content.dropboxapi.com/2/files/download', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Dropbox-API-Arg': `{"path":  "${entry.path_display}"}`,
            }
          })
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

              let notesOfFolderIndex = 0;
              let notesOfFolder = noteList
                .filter((folder, index) => {
                  notesOfFolderIndex = index
                  return folder.folderKey === response.folder
                })[0].notes

              notesOfFolder.push({
                fileName: entry.name,
                content: response.content,
                path: entry.path_display,
                updatedAt: response.updatedAt,
              })
              notesOfFolder.sort((a, b) => {
                return a.updatedAt < b.updatedAt ? 1 : -1
              })
              noteList.splice(notesOfFolderIndex, 1, notesOfFolder)

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

  getAccessToken() {
    fetch(`https://api.dropboxapi.com/oauth2/token?code=${this.state.code}&grant_type=authorization_code&client_id=${settings.dropboxClientId}&client_secret=${settings.dropboxClientSecret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error()
        }
        return response.json()
      })
      .then((response) => {
        AsyncStorage.setItem(DROPBOX_ACCESS_TOKEN, response.access_token)
          .then((values) => {
            this.getToken()
          })
          .catch((e) => {
            Alert.alert(
              'Something wrong',
              'Please retry',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            )
          })
      })
      .catch((e) => {
        Alert.alert(
          'Cannot authorize',
          'Please input a valid token',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      })
  }

  setNoteModalOpen(path) {
    this.setState({
      path: path,
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
      <Container>
        <Content>
          <ActivityIndicator animating={this.state.isLoading}/>
          {
            // Show Dropbox connect button when...
            // 1. Not connected to Dropbox.
            // 2. Not loading.
            !this.state.isConnectedToDropbox && !this.state.isLoading ?
              <View>
                <View style={styles.dropboxLinkButtonWrap}>
                  <Button style={styles.dropboxLinkButton}
                          onPress={() => Linking.openURL(`https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${settings.dropboxClientId}`)}>
                    <Text style={styles.dropboxLinkButtonText}>
                      <Icon name='logo-dropbox' style={{
                        color: '#2BA6FA',
                        fontSize: 16,
                        textAlignVertical: 'center'
                      }}/> Tap here to sign in to Dropbox!
                    </Text>
                  </Button>
                </View>
                <View style={{ height: 50, marginTop: 20, marginLeft: 20, marginRight: 20, flexDirection: 'row' }}>
                  <TextInput
                    style={{
                      flex: 5,
                      height: 35,
                      marginRight: 10,
                      paddingLeft: 5,
                      borderColor: '#F3F4F4',
                      borderWidth: 1
                    }}
                    placeholder={'Input code here!'}
                    onChangeText={(text) => this.setState({ code: text })}
                  />
                  <Button
                    style={{ flex: 1, backgroundColor: '#F3F4F4', height: 35, width: 35, }}
                    onPress={this.getAccessToken.bind(this)}>
                    <Text>Send!</Text>
                  </Button>
                </View>
              </View>
              : null
          }
          {
            // Show link of how to blog post when...
            // 1. Connected to Dropbox.
            // 2. Not connected to Boostnote.
            // 3. Not loading.
            this.state.isConnectedToDropbox && this.state.isNotConnectedToBoostnote && !this.state.isLoading ?
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.bottomLinkWord}>Connect with Desktop app and create a note!</Text>
                <View style={{
                  marginTop: 20,
                  backgroundColor: '#F3F4F4',
                  height: 30,
                  width: 150,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text
                    onPress={() => Linking.openURL('https://medium.com/boostnote/boostnote-mobile-how-to-synchronize-with-dropbox-95d845581eea')}>
                    <Icon style={{ fontSize: 16, color: '#89888d', paddingLeft: 20 }} name='link'/>
                    How to connect?
                  </Text>
                </View>
              </View>
              : null
          }
          <Card transparent style={styles.noteListWrap}>
            {
              this.state.noteList.map((folder, index, array) => {
                return <View key={index}>
                  <CardItem
                    key={folder.folderKey}
                    itemDivider>
                    <Text>{folder.folderName}</Text>
                  </CardItem>
                  {
                    folder && folder.notes && folder.notes.map((note) => {
                      return <CardItem
                        style={styles.noteList}
                        key={note.fileName}
                        button onPress={() => this.setNoteModalOpen(note.path)}>
                        <Body>
                        <View style={styles.noteListIconWrap}>
                          <Icon name='md-code-working' style={styles.noteListIcon}/>
                        </View>
                        <Text numberOfLines={1}
                              style={styles.noteListText}>{note.content}</Text>
                        <Text style={styles.noteListDate}>{moment(note.updatedAt).format('MMM D')}</Text>
                        </Body>
                      </CardItem>
                    })
                  }
                </View>
              })
            }
          </Card>
          <DropboxNoteModal setNoteModalClose={this.setNoteModalClose.bind(this)}
                            isNoteOpen={this.state.isNoteOpen}
                            path={this.state.path}/>
        </Content>
        {
          // Show refresh button when not loading when...
          // 1. Connected to Dropbox.
          // 2. Connected to Boostnote.
          // 3. Not loading.
          this.state.isConnectedToDropbox && !this.state.isNotConnectedToBoostnote && !this.state.isLoading ?
            <View>
              <Button
                transparent
                style={styles.refreshButtonWrap}
                onPress={() => this.getToken()}>
                <View style={styles.refreshButton}>
                  <Icon name='md-refresh' style={{ color: "#fff" }}/>
                </View>
              </Button>
            </View>
            : null
        }
      </Container>
    )
  }
}