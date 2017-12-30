import React from 'react'
import {
  Keyboard,
  Dimensions,
  Text,
  Platform,
  View,
  Clipboard,
  ScrollView,
  TextInput
} from 'react-native'
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Right,
  Icon,
  ActionSheet,
  Root
} from 'native-base'

import Modal from 'react-native-modalbox'
import NotePreview from './preview/NotePreviewComponent'
import NoteInputSupport from './inputSupport/NoteInputSupport'
import RNFetchBlob from 'react-native-fetch-blob'
import styles from './NoteModalStyle'
const fs = RNFetchBlob.fs

export default class NoteModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      fileName: this.props.fileName,
      text: this.props.content,
      height: 0,
      isEditting: true,
      visibleHeight: 230,
      endOfSelection: 0
    }
    this.keyboardDidShow = this.keyboardDidShow.bind(this)
    this.keyboardDidHide = this.keyboardDidHide.bind(this)
  }

  componentWillReceiveProps (props) {
    // if user is opening a same file, set state.
    if (props.fileName === this.state.fileName) {
      return
    }

    // if user open an another file, set state.
    this.setState({
      isEditting: true,
      fileName: props.fileName,
      text: props.content
    })
  }

  onChangeText (text) {
    this.setState({
      text: text
    })
    const dirs = RNFetchBlob.fs.dirs
    fs.writeFile(`${dirs.DocumentDir}/Boostnote/${this.state.fileName}`, text, 'utf8')
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
      visibleHeight: Dimensions.get('window').height - e.endCoordinates.height - 100
    })
  }

  keyboardDidHide (e) {
    this.setState({
      visibleHeight: Dimensions.get('window').height - 100
    })
  }

  getNoteComponent () {
    if (this.state.isEditting) {
      return <View style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <TextInput
            ref='TextInput'
            multiline
            style={Platform.OS === 'android'
              ? { margin: 8, height: this.state.visibleHeight - 30 }
              : { margin: 8, height: this.state.visibleHeight - 20 }}
            onChangeText={(e) => this.onChangeText(e)}
            value={this.state.text}
            onSelectionChange={(e) => {
              this.setState({endOfSelection: e.nativeEvent.selection.end})
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
        text={this.state.text}
        onTapCheckBox={this.tapCheckBox.bind(this)}
      />
    }
  }

  /**
     * Insert markdown characters to the text of selected place.
     * @param character Markdown character
     */
  insertMarkdownBetween (character) {
    const beforeText = this.state.text.substring(0, this.state.endOfSelection)
    const afterText = this.state.text.substring(this.state.endOfSelection, this.state.text.length)

    this.setState({
      text: beforeText + character + afterText
    })
  }

  /**
     * Paste from clipboard to the text
     */
  async pasteContent () {
    const beforeText = this.state.text.substring(0, this.state.endOfSelection)
    const afterText = this.state.text.substring(this.state.endOfSelection, this.state.text.length)

    this.setState({
      text: beforeText + await Clipboard.getString() + '\n' + afterText
    })
  }

  /**
     * Toggle checkbox in markdown text
     * @param line
     */
  tapCheckBox (line) {
    const lines = this.state.text.split('\n')

    const targetLine = lines[line]

    const checkedMatch = /\[x\]/i
    const uncheckedMatch = /\[ \]/
    if (targetLine.match(checkedMatch)) {
      lines[line] = targetLine.replace(checkedMatch, '[ ]')
    }
    if (targetLine.match(uncheckedMatch)) {
      lines[line] = targetLine.replace(uncheckedMatch, '[x]')
    }
    this.onChangeText(lines.join('\n'))
  }

  handleSwitchEditButtonClick () {
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  render () {
    return (
      <Modal
        coverScreen
        isOpen={this.props.isNoteOpen}
        position={'top'}
        swipeToClose={false}
        onClosed={() => this.props.setIsOpen('', false)}>
        <Container>
          <Header style={Platform.OS === 'android' ? {height: 47, backgroundColor: '#f9f9f9'} : {backgroundColor: '#f9f9f9'}} androidStatusBarColor='#239F85'>
            <Left style={Platform.OS === 'android' ? {top: 0} : null}>
              <Button transparent onPress={() => this.props.setIsOpen('', false)}>
                <Text><Icon name='ios-arrow-back' style={styles.noteDetailButton} /></Text>
                <Text style={styles.backHomeText}>All Notes</Text>
              </Button>
            </Left>

            <Right style={Platform.OS === 'android' ? {top: 0} : {top: 3}}>
              <View>
                <Root>
                  <Button transparent
                    style={styles.switchEditButton}
                    onPress={this.handleSwitchEditButtonClick.bind(this)}>
                    <Text style={styles.switchEditText}>
                      {this.state.isEditting ? 'Save' : 'Edit'}
                    </Text>
                  </Button>
                  <Button transparent onPress={() => ActionSheet.show(
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
                        fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/Boostnote/${this.state.fileName}`)
                          .then(() => {
                            this.props.setIsOpen('', false)
                          })
                      }
                    }
                  )}>
                    <Text><Icon name='ios-more' style={styles.noteDetailButton} /></Text>
                  </Button>
                </Root>
              </View>
            </Right>
          </Header>
          <Content keyboardShouldPersistTaps='always'>
            {this.getNoteComponent()}
          </Content>
        </Container>
      </Modal>
    )
  }
}
