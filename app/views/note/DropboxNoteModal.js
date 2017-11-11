import React from 'react'
import {
  Keyboard,
  Dimensions,
  Text,
  Platform,
  AsyncStorage,
  View,
  Clipboard,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Body,
  Right,
  Icon,
  Segment,
  ActionSheet,
} from 'native-base'

import Modal from 'react-native-modalbox'
import CoffeeScript from '../../lib/CofeeScriptEval'

const js2coffee = require('js2coffee/dist/js2coffee');
import MultilineTextInput from '../../components/MultilineTextInput'
import NotePreview from './preview/NotePreviewComponent'
import NoteInputSupport from './inputSupport/NoteInputSupport'
import removeMd from 'remove-markdown-and-html'

const DROPBOX_ACCESS_TOKEN = 'DROPBOX:ACCESS_TOKEN'

const styles = {
  switchButton: {
    backgroundColor: 'transparent',
    borderColor: '#EFF1F5',
    borderWidth: 1
  },
  switchButtonActive: {
    backgroundColor: '#EFF1F5',
    borderColor: '#EFF1F5',
    borderWidth: 1
  },
  noteDetailButton: {
    color: '#EFF1F5',
    fontSize: 23
  },
}

export default class DropboxNoteModal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      token: '',
      path: props.path,
      note: { content: '' },
      height: 0,
      isLeftSegmentActive: true,
      visibleHeight: 230,
      endOfSelection: 0,
      isNoteOpen: props.isNoteOpen,
    }
    this.keyboardDidShow = this.keyboardDidShow.bind(this)
    this.keyboardDidHide = this.keyboardDidHide.bind(this)
  }

  componentWillReceiveProps(props) {
    if ((this.state.isNoteOpen !== props.isNoteOpen) && props.isNoteOpen && props.path) {
      this.getNoteData(props.path)

      this.setState({
        isLeftSegmentActive: true,
        path: props.path,
      })
    }
    this.setState({
      isNoteOpen: props.isNoteOpen
    })
  }

  getNoteData(path) {
    this.setState({
      isLoading: true
    })
    AsyncStorage.getItem(DROPBOX_ACCESS_TOKEN)
      .then((value) => {
        this.setState({
          token: value
        })
        return value
      })
      .then((token) => {
        fetch('https://content.dropboxapi.com/2/files/download', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Dropbox-API-Arg': `{"path":  "${path}"}`,
          }
        })
          .then((response) => {
            return response.text()
          })
          .then((responseCson) => {
            const response = CoffeeScript.eval(responseCson)

            if (response.type !== 'MARKDOWN_NOTE' || response.isTrashed) {
              // Do nothing
              // Parse not trashed markdown only now
              return
            }

            this.setState({
              note: response,
              isLoading: false,
            })
          })
          .catch((error) => {
            this.setState({
              isLoading: false,
            })
            console.log(error)
          })
      })

  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow(e) {
    this.setState({
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100,
    })
  }

  keyboardDidHide(e) {
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100,
    })
  }

  getNoteComponent() {
    if (this.state.isLeftSegmentActive) {
      return <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <MultilineTextInput
            ref="TextInput"
            style={Platform.OS === 'android' ? { margin: 8, height: this.state.visibleHeight - 30 } : {
              margin: 8,
              height: this.state.visibleHeight - 15
            }}
            onChangeText={(e) => this.onChangeText(e)}
            value={this.state.note.content}
            selectionChange={(e) => {
              this.setState({ endOfSelection: e.nativeEvent.selection.end })
            }}
            autoFocus={true}
            textAlignVertical={'top'}>
          </MultilineTextInput>
          <NoteInputSupport
            insertMarkdownBetween={this.insertMarkdownBetween.bind(this)}
            pasteContent={this.pasteContent.bind(this)}
          />
        </ScrollView>
      </View>
    } else {
      return <NotePreview text={this.state.note.content}/>
    }
  }

  onChangeText(text) {
    this.updateNoteContent(text)
  }

  /**
   * Insert markdown characters to the text of selected place.
   * @param character Markdown character
   */
  insertMarkdownBetween(character) {
    const beforeText = this.state.note.content.substring(0, this.state.endOfSelection)
    const afterText = this.state.note.content.substring(this.state.endOfSelection, this.state.note.content.length)

    this.updateNoteContent(beforeText + character + afterText)
  }

  /**
   * Paste from clipboard to the text
   */
  async pasteContent() {
    const beforeText = this.state.note.content.substring(0, this.state.endOfSelection)
    const afterText = this.state.note.content.substring(this.state.endOfSelection, this.state.note.content.length)

    const newText = beforeText + await Clipboard.getString() + '\n' + afterText
    this.updateNoteContent(newText)
  }

  updateNoteContent(text) {
    this.setState((prevState, props) => {
      prevState.note.content = text
      prevState.note.title = removeMd(text.split('\n')[0])
      prevState.note.updatedAt = new Date()
      return { note: prevState.note }
    })

  }

  saveNoteToDropbox() {
    fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Dropbox-API-Arg': `{"path":  "${this.state.path}", "mode": "overwrite", "autorename": false, "mute": false }`,
        'Content-Type': 'application/octet-stream',
      },
      body: js2coffee.build('(' + JSON.stringify(this.state.note) + ');').code
    })
      .catch((error) => {
        // some error handling?
        console.log(error)
      })
  }

  onCloseModal() {
    this.saveNoteToDropbox()
    this.props.setNoteModalClose()

  }

  render() {
    return (
      <Modal
        coverScreen={true}
        isOpen={this.state.isNoteOpen}
        position={'top'}
        onClosed={() => this.onCloseModal()}>
        <Container>
          <Header style={Platform.OS === 'android' ? {
            height: 47,
            backgroundColor: '#6C81A6'
          } : { backgroundColor: '#6C81A6' }} androidStatusBarColor='#239F85'>
            <Left style={Platform.OS === 'android' ? { top: 0 } : null}>
              <Button transparent onPress={() => this.props.setNoteModalClose()} disable={this.state.isLoading}>
                <Text><Icon name='md-close' style={styles.noteDetailButton}/></Text>
              </Button>
            </Left>

            <Body style={Platform.OS === 'android' ? { top: 0 } : null}>
            <Segment style={Platform.OS === 'android' ? {
              paddingRight: 25,
              position: 'relative',
              backgroundColor: 'transparent',
              borderWidth: 1
            } : { marginLeft: 50, position: 'absolute', top: -22, backgroundColor: 'transparent' }}>
              <Button onPress={() => {
                this.setState({ isLeftSegmentActive: true })
              }} first active={this.state.isLeftSegmentActive}
                      style={this.state.isLeftSegmentActive ? styles.switchButtonActive : styles.switchButton}>
                <Text><Icon name='create' style={this.state.isLeftSegmentActive ? { color: '#6C81A6' } : {}}/></Text>
              </Button>
              <Button onPress={() => {
                this.setState({ isLeftSegmentActive: false })
              }} last active={!this.state.isLeftSegmentActive}
                      style={this.state.isLeftSegmentActive ? styles.switchButton : styles.switchButtonActive}>
                <Text><Icon name='eye'
                            style={this.state.isLeftSegmentActive ? { color: '#EFF1F5' } : { color: '#6C81A6' }}/></Text>
              </Button>
            </Segment>
            </Body>
            <Right style={Platform.OS === 'android' ? { top: 0 } : null}>
              <Button transparent onPress={() => ActionSheet.show(
                {
                  options: ["Delete", "Cancel"],
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                },
                buttonIndex => {
                  // `buttonIndex` is a string in Android, a number in iOS.
                  if (Platform.OS === 'android' && buttonIndex === '0'
                    || Platform.OS === 'ios' && buttonIndex === 0) {
                    this.setState((prevState, props) => {
                      prevState.note.isTrashed = true
                      return { note: prevState.note }
                    }, this.onCloseModal())
                  }
                }
              )}>
                <Text><Icon name='md-more' style={styles.noteDetailButton}/></Text>
              </Button>
            </Right>
          </Header>
          <Content keyboardShouldPersistTaps='always'>
            <ActivityIndicator animating={this.state.isLoading}/>
            {this.state.isLoading ?
              null :
              this.getNoteComponent()}
          </Content>
        </Container>
      </Modal>
    )
  }
}
