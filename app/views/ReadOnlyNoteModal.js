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
    Icon,
} from 'native-base'

import createMarkdownRenderer from 'rn-markdown'
const Markdown = createMarkdownRenderer({gfm: true, tables: true})

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
            text: this.props.content,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            text: props.content,
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

        return <View style={{margin: 15}}>
            <Markdown contentContainerStyle={styles.container} markdownStyles={markdownStyles}>
                {this.state.text}
            </Markdown>
        </View>
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
                    <Header style={Platform.OS === 'android' ? {
                        height: 47,
                        backgroundColor: '#6C81A6'
                    } : {backgroundColor: '#6C81A6'}} androidStatusBarColor='#239F85'>
                        <Left style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => this.props.setNoteModalClose()}>
                                <Text><Icon name='md-close' style={styles.noteDetailButton}/></Text>
                            </Button>
                        </Left>
                    </Header>
                    <Content keyboardShouldPersistTaps='always'>
                        {this.getNoteComponent()}
                    </Content>
                </Container>
            </Modal>
        )
    }
}
