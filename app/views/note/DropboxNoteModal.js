import React from 'react'
import {
  Keyboard,
  Dimensions,
  Platform,
  AsyncStorage,
  View,
  Clipboard,
  ActivityIndicator,
  ScrollView,
  TextInput
} from 'react-native'
import {
  Container,
  Content,
  ActionSheet
} from 'native-base'

import Modal from 'react-native-modalbox'
import CoffeeScript from '../../lib/CofeeScriptEval'
import NotePreview from './preview/NotePreviewComponent'
import NoteInputSupport from './inputSupport/NoteInputSupport'
import removeMd from 'remove-markdown-and-html'
import styles from './NoteModalStyle'
import HeaderComponent from './HeaderComponent'

const js2coffee = require('js2coffee/dist/js2coffee')

const DROPBOX_ACCESS_TOKEN = 'DROPBOX:ACCESS_TOKEN'

export default class DropboxNoteModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      token: '',
      path: props.path,
      note: { content: '' },
      height: 0,
      isEditting: true,
      visibleHeight: 230,
      endOfSelection: 0,
      isNoteOpen: props.isNoteOpen
    }
    this.keyboardDidShow = this.keyboardDidShow.bind(this)
    this.keyboardDidHide = this.keyboardDidHide.bind(this)
  }

  componentWillReceiveProps (props) {
    if ((this.state.isNoteOpen !== props.isNoteOpen) && props.isNoteOpen && props.path) {
      this.getNoteData(props.path)

      this.setState({
        isEditting: true,
        path: props.path
      })
    }
    this.setState({
      isNoteOpen: props.isNoteOpen
    })
  }

  getNoteData (path) {
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
            'Dropbox-API-Arg': `{"path":  "${path}"}`
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
              isLoading: false
            })
          })
          .catch((error) => {
            this.setState({
              isLoading: false
            })
            console.log(error)
          })
      })
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow (e) {
    this.setState({
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 140
    })
  }

  keyboardDidHide (e) {
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100
    })
  }

  getNoteComponent () {
    if (this.state.isEditting) {
      return <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <TextInput
            ref='TextInput'
            multiline
            style={{ margin: 8, height: this.state.visibleHeight - 55 }}
            onChangeText={(e) => this.onChangeText(e)}
            value={this.state.note.content}
            onSelectionChange={(e) => {
              this.setState({ endOfSelection: e.nativeEvent.selection.end })
            }}
            autoFocus
            textAlignVertical={'top'} />
          <NoteInputSupport
            insertMarkdownBetween={this.insertMarkdownBetween.bind(this)}
            pasteContent={this.pasteContent.bind(this)}
          />
        </ScrollView>
      </View>
    } else {
      return <NotePreview
        text={this.state.note.content}
        onTapCheckBox={this.tapCheckBox.bind(this)}
      />
    }
  }

  onChangeText (text) {
    this.updateNoteContent(text)
  }

  /**
   * Insert markdown characters to the text of selected place.
   * @param character Markdown character
   */
  insertMarkdownBetween (character) {
    const beforeText = this.state.note.content.substring(0, this.state.endOfSelection)
    const afterText = this.state.note.content.substring(this.state.endOfSelection, this.state.note.content.length)

    this.updateNoteContent(beforeText + character + afterText)
  }

  /**
   * Paste from clipboard to the text
   */
  async pasteContent () {
    const beforeText = this.state.note.content.substring(0, this.state.endOfSelection)
    const afterText = this.state.note.content.substring(this.state.endOfSelection, this.state.note.content.length)

    const newText = beforeText + await Clipboard.getString() + '\n' + afterText
    this.updateNoteContent(newText)
  }

  updateNoteContent (text) {
    this.setState((prevState, props) => {
      prevState.note.content = text
      prevState.note.title = removeMd(text.split('\n')[0])
      prevState.note.updatedAt = new Date()
      return { note: prevState.note }
    })
  }

  saveNoteToDropbox () {
    fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Dropbox-API-Arg': `{"path":  "${this.state.path}", "mode": "overwrite", "autorename": false, "mute": false }`,
        'Content-Type': 'application/octet-stream'
      },
      body: js2coffee.build('(' + JSON.stringify(this.state.note) + ');').code
    })
      .catch((error) => {
        // some error handling?
        console.log(error)
      })
  }

  onCloseModal () {
    this.saveNoteToDropbox()
    this.props.setNoteModalClose()
  }

  /**
   * Toggle checkbox in markdown text
   * @param line
   */
  tapCheckBox (line) {
    const lines = this.state.note.content.split('\n')

    const targetLine = lines[line]

    const checkedMatch = /\[x\]/i
    const uncheckedMatch = /\[ \]/
    if (targetLine.match(checkedMatch)) {
      lines[line] = targetLine.replace(checkedMatch, '[ ]')
    }
    if (targetLine.match(uncheckedMatch)) {
      lines[line] = targetLine.replace(uncheckedMatch, '[x]')
    }
    this.updateNoteContent(lines.join('\n'))
  }

  handleSwitchEditButtonClick () {
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  handlePressDetailButton () {
    ActionSheet.show(
      {
        options: ['Delete', 'Cancel'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0
      },
      buttonIndex => {
        // `buttonIndex` is a string in Android, a number in iOS.
        const androidCondition = Platform.OS === 'android' && buttonIndex === '0'
        const iosCondition = Platform.OS === 'ios' && buttonIndex === 0
        if (androidCondition || iosCondition) {
          this.setState((prevState, props) => {
            prevState.note.isTrashed = true
            return { note: prevState.note }
          }, this.onCloseModal())
        }
      }
    )
  }

  render () {
    return (
      <Modal
        coverScreen
        isOpen={this.state.isNoteOpen}
        position={'top'}
        swipeToClose={false}
        onClosed={() => this.onCloseModal()}>
        <Container>
          <HeaderComponent
            setIsOpen={this.props.setIsOpen}
            folderName='Dropbox'
            handleSwitchEditButtonClick={this.handleSwitchEditButtonClick.bind(this)}
            isEditting={this.state.isEditting}
            handlePressDetailButton={this.handlePressDetailButton.bind(this)} />
          <Content keyboardShouldPersistTaps='always'>
            <ActivityIndicator animating={this.state.isLoading} />
            {this.state.isLoading
              ? null
              : this.getNoteComponent()}
          </Content>
        </Container>
      </Modal>
    )
  }
}
