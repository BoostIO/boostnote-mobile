import React from 'react'
import {
    Text,
    Platform,
} from 'react-native'
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Icon,
} from 'native-base'

import Modal from 'react-native-modalbox'
import NotePreview from './preview/NotePreviewComponent'

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

export default class ReadOnlyNoteModal extends React.Component {

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

    render() {
        return (
          <Modal
            coverScreen={true}
            isOpen={this.props.isNoteOpen}
            position={'top'}
            onClosed={() => this.props.setNoteModalClose()}>
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
                        <NotePreview text={this.state.text}/>
                    </Content>
                </Container>
            </Modal>
        )
    }
}
