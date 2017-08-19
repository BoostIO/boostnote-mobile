import React from 'react';
import {Text, Platform, Modal, View, TextInput} from 'react-native';
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
} from 'native-base';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Markdown from 'react-native-simple-markdown';
import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

const styles = {
    switchButton: {
        backgroundColor: 'transparent',
        borderColor: '#E7E4E6'
    },
    switchButtonActive: {
        backgroundColor: '#BCB5B9',
        borderColor: '#E7E4E6'

    },
    noteDetailButton: {
        color: '#BCB5B9',
        fontSize: 21
    }
}

export default class NoteModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: this.props.fileName,
            text: this.props.content,
            height: 0,
            isLeftSegmentActive: true,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            isLeftSegmentActive: true,
            fileName: props.fileName,
            text: props.content,
        });
    }

    onChangeText(e) {
        const text = e.nativeEvent.text;
        this.setState({
            text: text,
            height: e.nativeEvent.contentSize.height,
        });
        const dirs = RNFetchBlob.fs.dirs;
        fs.createFile(`${dirs.DocumentDir}/Boostnote/${this.state.fileName}`, text, 'utf8');

    };

    getNoteComponent() {
        if (this.state.isLeftSegmentActive) {
            return <KeyboardAwareScrollView>
                <View>
                    <TextInput
                        style={{
                            margin: 8,
                            height: Math.max(35, this.state.height)
                        }}
                        onChange={(e) => this.onChangeText(e)}
                        value={this.state.text}
                        multiline={true}/>
                </View>
            </KeyboardAwareScrollView>;
        } else {
            return <View style={{margin: 15}}>
                <Markdown>
                    {this.state.text}
                </Markdown>
            </View>
        }
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
                    <Header style={Platform.OS === 'android' ? {height: 47,backgroundColor: '#F7F7F7'} : {backgroundColor: '#F7F7F7'}}>
                        <Left style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => this.props.setIsOpen('', false)}>
                                <Icon name='md-close' style={styles.noteDetailButton}/>
                            </Button>
                        </Left>

                        <Body style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Segment style={{marginLeft: '47%', position: 'absolute', top: -22}}>
                                <Button onPress={() => {
                                    this.setState({isLeftSegmentActive: true});
                                }} first active={this.state.isLeftSegmentActive}
                                style={this.state.isLeftSegmentActive ? styles.switchButtonActive : styles.switchButton}>
                                    <Icon name='create' style={this.state.isLeftSegmentActive ? {} : {color: '#BCB5B9'}}/>
                                </Button>
                                <Button onPress={() => {
                                    this.setState({isLeftSegmentActive: false});
                                }} last active={!this.state.isLeftSegmentActive}
                                style={this.state.isLeftSegmentActive ? styles.switchButton : styles.switchButtonActive}>
                                    <Icon name='eye' style={this.state.isLeftSegmentActive ? {color: '#BCB5B9'} : {}}/>
                                </Button>
                            </Segment>
                        </Body>

                        <Right style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => ActionSheet.show(
                                {
                                    options: ["Delete", "Cancel"],
                                    cancelButtonIndex: 1,
                                    destructiveButtonIndex: 0,
                                    title: "Option"
                                },
                                buttonIndex => {
                                    if (buttonIndex === 0) {
                                        fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/Boostnote/${this.state.fileName}`)
                                        .then(() => {
                                            this.props.setIsOpen('', false);
                                        });
                                    }
                                }
                            )}>
                                <Icon name='md-more' style={styles.noteDetailButton}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {this.getNoteComponent()}
                    </Content>
                </Container>
            </Modal>
        );
    };
}
