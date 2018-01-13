import React, {Component} from 'react'
import {
  Text,
  TextInput,
  View,
  Alert,
  AsyncStorage,
  RefreshControl,
  Linking
} from 'react-native'
import {
  Body,
  Card,
  Icon,
  CardItem,
  Button,
  Content,
  ActionSheet
} from 'native-base'
import moment from 'moment'
import CoffeeScript from '../lib/CofeeScriptEval'
import settings from '../config/settings'
import {makeRandomHex} from '../lib/Strings'
import DropboxNoteModal from './note/DropboxNoteModal'

const js2coffee = require('js2coffee/dist/js2coffee')
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
    backgroundColor: 'rgba(244,244,244,0.1)'
  },
  iosHeader: {
    backgroundColor: '#239F85'
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
  noteListText: {
    position: 'absolute',
    color: '#3a3941',
    backgroundColor: 'transparent',
    top: 15,
    fontSize: 14,
    width: '73%',
    marginLeft: 10
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
    width: 300
  },
  dropboxLinkButtonText: {
    color: '#262626',
    fontWeight: '600',
    fontSize: 14,
    textAlignVertical: 'center'
  },
  refreshButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 10
  }
}

export default class DropboxNoteList extends Component {
  constructor () {
    super()
    this.state = {
      token: '',
      folderList: {},
      noteList: [],
      note: '',
      isNoteOpen: false,
      isLoading: false,
      isNotConnectedToBoostnote: false,
      code: ''
    }
    this.actionSheet = null
  }

  componentDidMount () {
    this.getToken()
  }

  getToken () {
    AsyncStorage.getItem(DROPBOX_ACCESS_TOKEN)
      .then((value) => {
        if (value === null) {
          this.props.setIsConnectedToDropbox(false)
        } else {
          this.props.setIsConnectedToDropbox(true)
          this.setState({
            token: value
          }, this.getDropboxNoteData(value))
        }
      })
      .catch((e) => {
        this.props.setIsConnectedToDropbox(false)
      })
  }

  getDropboxNoteData (token) {
    this.setState({
      noteList: [],
      isLoading: true
    })

    // Download folder data
    fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Dropbox-API-Arg': `{"path":  "/boostnote.json"}`
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path: '/notes',
            recursive: false,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: false
          })
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        const noteList = []

        if (responseJson.error_summary && responseJson.error_summary.startsWith('path/not_found/')) {
          this.props.setIsConnectedToDropbox(true)
        }
        if (!responseJson.entries || responseJson.entries.length === 0) {
          this.setState({
            isLoading: false
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

        // Get data from newest note to older note
        responseJson.entries.reverse()
        responseJson.entries.forEach(entry => {
          if (!entry.name.endsWith('.cson')) {
            // Do nothing
            // Parse cson file only now
            this.setState({
              isLoading: false
            })
            return
          }

          // Download each note data
          fetch('https://content.dropboxapi.com/2/files/download', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Dropbox-API-Arg': `{"path":  "${entry.path_display}"}`
            }
          })
            .then((response) => {
              return response.text()
            })
            .then((responseCson) => {
              this.setState({
                isLoading: false
              })

              const response = CoffeeScript.eval(responseCson)
              if (response.type !== 'MARKDOWN_NOTE' || response.isTrashed) {
                // Do nothing
                // Parse not trashed markdown only now
                return
              }

              const notesOfFolder = noteList
                .filter(folder => {
                  return folder.folderKey === response.folder
                })[0].notes

              notesOfFolder.push({
                fileName: entry.name,
                content: response.content,
                path: entry.path_display,
                updatedAt: response.updatedAt
              })
              notesOfFolder.sort((a, b) => {
                return a.updatedAt < b.updatedAt ? 1 : -1
              })

              this.setState({
                noteList: noteList
              })
            })
            .catch((error) => {
              this.setState({
                isLoading: false
              })
              console.log(error)
            })
        })
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
        console.log(error)
      })
  }

  getAccessToken () {
    fetch(`https://api.dropboxapi.com/oauth2/token?code=${this.state.code}&grant_type=authorization_code&client_id=${settings.dropboxClientId}&client_secret=${settings.dropboxClientSecret}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
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
          .then((value) => {
            this.getToken()
          })
          .catch((e) => {
            Alert.alert(
              'Something wrong',
              'Please retry',
              [
                { text: 'OK' }
              ],
              { cancelable: false }
            )
          })
      })
      .catch((e) => {
        Alert.alert(
          'Cannot authorize',
          'Please restart this app and input a valid token',
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        )
      })
  }

  setNoteModalOpen (path) {
    this.setState({
      path: path,
      isNoteOpen: true
    })
  }

  setNoteModalClose () {
    this.setState({
      isNoteOpen: false
    })
  }

  createNewNote () {
    const folderChooseMenu = this.state.folderList.map(folder => folder.name)
    folderChooseMenu.push('Cancel')
    if (this.actionSheet !== null) {
      this.actionSheet._root.showActionSheet(
        {
          options: folderChooseMenu,
          cancelButtonIndex: this.state.folderList.length,
          title: 'Choose folder to create note'
        },
        buttonIndex => {
          if (buttonIndex === this.state.folderList.length) {
            return
          }
          const newNotePath = `"/notes/${makeRandomHex()}.cson"`
          const newNoteJson = JSON.stringify({
            type: 'MARKDOWN_NOTE',
            folder: this.state.folderList[buttonIndex].key,
            title: '',
            content: '',
            tags: [],
            isStarred: false,
            isTrashed: false,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.state.token}`,
              'Dropbox-API-Arg': `{"path": ${newNotePath}, "mode": "overwrite", "autorename": false, "mute": false }`,
              'Content-Type': 'application/octet-stream'
            },
            body: js2coffee.build('(' + newNoteJson + ');').code
          })
            .then((response) => {
              this.getDropboxNoteData(this.state.token)
            })
            .catch((error) => {
              // some error handling?
              console.log(error)
            })
        }
      )
    }
  }

  render () {
    return (
      <Content
        keyboardShouldPersistTaps='always'
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={() => this.getDropboxNoteData(this.state.token)}
          />
        }>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          height: 40,
          backgroundColor: '#F3F4F4'
        }}>
          <Text style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            left: 10,
            top: 12,
            color: 'rgba(40,44,52,0.4)',
            fontSize: 13,
            fontWeight: '600'
          }}>
            Dropbox
          </Text>
          <Button style={styles.refreshButton} onPress={() => this.getToken()}>
            <Text style={{ color: 'rgba(40,44,52,0.4)', right: 1, position: 'absolute' }}>
              <Icon name='md-refresh' style={{color: 'rgba(40,44,52,0.4)'}} />
            </Text>
          </Button>
        </View>
        {
          // Show Dropbox connect button when...
          // 1. Not connected to Dropbox.
          // 2. Not loading.
          !this.props.isConnectedToDropbox && !this.state.isLoading
            ? <View>
              <View style={styles.dropboxLinkButtonWrap}>
                <Button style={styles.dropboxLinkButton}
                  onPress={() => Linking.openURL(`https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${settings.dropboxClientId}`)}>
                  <Text style={styles.dropboxLinkButtonText}>
                    <Icon name='logo-dropbox' style={{
                      color: '#2BA6FA',
                      fontSize: 16,
                      textAlignVertical: 'center'
                    }} /> Tap here to sign in to Dropbox!
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
                  style={{ flex: 1, backgroundColor: '#F3F4F4', height: 35, width: 35 }}
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
          this.props.isConnectedToDropbox && this.state.isNotConnectedToBoostnote && !this.state.isLoading
            ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                  <Icon style={{ fontSize: 16, color: '#89888d', paddingLeft: 20 }} name='link' />
                  How to connect?
                </Text>
              </View>
            </View>
            : null
        }
        <Card transparent style={styles.noteListWrap}>
          <View>
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
          </View>
        </Card>
        <DropboxNoteModal setIsOpen={this.setNoteModalClose.bind(this)}
          isNoteOpen={this.state.isNoteOpen}
          path={this.state.path} />
        <ActionSheet ref={c => (this.actionSheet = c)} />
      </Content>
    )
  }
}
