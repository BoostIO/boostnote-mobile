import React from 'react'
import {
    Keyboard,
    Dimensions,
    Text,
    Platform,
    Modal,
    View,
    TextInput,
    TouchableHighlight,
    Clipboard,
    ScrollView
} from 'react-native'
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Segment,
    ActionSheet,
} from 'native-base'

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs

import createMarkdownRenderer from 'rn-markdown'
const Markdown = createMarkdownRenderer({ gfm: true, tables: true })

import MultilineTextInput from '../components/MultilineTextInput'

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
   container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#F5FCFF',
   },
   inputElementsStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 3,
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
   },
   supportMain: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333'
   },
   supportSub: {
    fontSize: 10,
    textAlign: 'center',
    color: '#828282'
   }
}

export default class NoteModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            fileName: this.props.fileName,
            text: this.props.content,
            height: 0,
            isLeftSegmentActive: true,
            visibleHeight: 230,
            endOfSelection: 0,
        }
        this.keyboardDidShow = this.keyboardDidShow.bind(this)
        this.keyboardDidHide = this.keyboardDidHide.bind(this)
    }

    componentWillReceiveProps(props) {
        // if user is opening a same file, set state.
        if (props.fileName === this.state.fileName) {
            return
        }

        // if user open an another file, set state.
        this.setState({
            isLeftSegmentActive: true,
            fileName: props.fileName,
            text: props.content,
        })
    }

    onChangeText(text) {
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

    keyboardDidShow(e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height - 100
        this.setState({
            visibleHeight: newSize,
        })
    }

    keyboardDidHide(e) {
        this.setState({
            visibleHeight: Dimensions.get('window').height - 100,
        })
    }

    getNoteComponent() {
        const markdownStyles = {
            container: {
                paddingLeft: 10
            },
            heading1: {
                fontSize: 24,
                fontWeight: '600',
                color: '#222222',
            },
            link: {
                color: 'red',
            },
            mail_to: {
                color: 'orange',
            },
            text: {
                color: '#555555',
            },
            code: {
                backgroundColor: '#f0f0f0',
                marginTop: 5,
                marginBottom: 5
            },
            blockquote: {
                backgroundColor: '#f8f8f8',
                padding: 5
            }
            }

        if (this.state.isLeftSegmentActive) {
            return <View style={{flex: 1}}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <MultilineTextInput
                        ref="TextInput"
                        style={Platform.OS === 'android' ? { margin: 8, height: this.state.visibleHeight - 100} : { margin: 8, height: this.state.visibleHeight}}
                        onChangeText={(e) => this.onChangeText(e)}
                        value={this.state.text}
                        selectionChange={(e) => {
                            this.setState({endOfSelection: e.nativeEvent.selection.end})
                        }}
                        autoFocus={true}
                        textAlignVertical={'top'}>
                    </MultilineTextInput>
                    <View style={{flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.05)', paddingLeft: 5, paddingRight: 5}}>
                        <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('# ')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>#</Text>
                                <Text style={styles.supportSub}>Head</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('- ')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>-</Text>
                                <Text style={styles.supportSub}>List</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('*')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>*</Text>
                                <Text style={styles.supportSub}>Emph</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('```\n')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>```</Text>
                                <Text style={styles.supportSub}>Code</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('> ')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>&gt;</Text>
                                <Text style={styles.supportSub}>Quote</Text>
                            </View>
                        </TouchableHighlight>
                        {/* <TouchableHighlight
                            onPress={()=> {
                                this.insertMarkdownBetween('~~')
                            }}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <View>
                                <Text style={styles.supportMain}>~~</Text>
                                <Text style={styles.supportSub}>Stri</Text>
                            </View>
                        </TouchableHighlight> */}
                        <TouchableHighlight
                            onPress={this.pasteContent.bind(this)}
                            style={Platform.OS === 'android' ? '' : styles.inputElementsStyle} >
                            <Text style={{paddingTop: 6, marginLeft: 3, marginRight: 3, fontSize: 12, color: '#828282'}}>Paste</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
                </View>
        } else {
            return <View style={{margin: 15}}>
            <Markdown contentContainerStyle={styles.container} markdownStyles={markdownStyles}>
                {this.state.text}
            </Markdown>
            </View>
        }
    }

    /**
     * Insert markdown characters to the text of selected place.
     * @param Markdown character
     */
    insertMarkdownBetween(character) {
        const beforeText = this.state.text.substring(0, this.state.endOfSelection)
        const afterText = this.state.text.substring(this.state.endOfSelection, this.state.text.length)

        this.setState({
            text: beforeText + character + afterText
        })
    }

    /**
     * Paste from clipboard to the text
     */
    async pasteContent() {
        const beforeText = this.state.text.substring(0, this.state.endOfSelection)
        const afterText = this.state.text.substring(this.state.endOfSelection, this.state.text.length)

        this.setState({
            text: beforeText + await Clipboard.getString() + '\n' + afterText
        })
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.props.isNoteOpen}
                onRequestClose={() => {
                }}>
                <Container>
                    <Header style={Platform.OS === 'android' ? {height: 47,backgroundColor: '#6C81A6'} : {backgroundColor: '#6C81A6'}} androidStatusBarColor='#239F85'>
                        <Left style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => this.props.setIsOpen('', false)}>
                                <Text><Icon name='md-close' style={styles.noteDetailButton}/></Text>
                            </Button>
                        </Left>

                        <Body style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Segment style={Platform.OS === 'android' ? {paddingRight: 25, position: 'relative', backgroundColor: 'transparent', borderWidth:1} : {marginLeft: 50, position: 'absolute', top: -22, backgroundColor: 'transparent'}}>
                                <Button onPress={() => {
                                    this.setState({isLeftSegmentActive: true})
                                }} first active={this.state.isLeftSegmentActive}
                                style={this.state.isLeftSegmentActive ? styles.switchButtonActive : styles.switchButton}>
                                    <Text><Icon name='create' style={this.state.isLeftSegmentActive ? {color: '#6C81A6'} : {}}/></Text>
                                </Button>
                                <Button onPress={() => {
                                    this.setState({isLeftSegmentActive: false})
                                }} last active={!this.state.isLeftSegmentActive}
                                style={this.state.isLeftSegmentActive ? styles.switchButton : styles.switchButtonActive}>
                                    <Text><Icon name='eye' style={this.state.isLeftSegmentActive ? {color: '#EFF1F5'} : {color: '#6C81A6'}}/></Text>
                                </Button>
                            </Segment>
                        </Body>

                        <Right style={Platform.OS === 'android' ? {top: 0} : null}>
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
                                        fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/Boostnote/${this.state.fileName}`)
                                        .then(() => {
                                            this.props.setIsOpen('', false)
                                        })
                                    }
                                }
                            )}>
                                <Text><Icon name='md-more' style={styles.noteDetailButton}/></Text>
                            </Button>
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
