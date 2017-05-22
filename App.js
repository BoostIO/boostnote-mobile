import React, { Component } from 'react';
import {Text, Platform, Modal, View, TextInput} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Drawer,
    Card,
    CardItem,
    Fab,
} from 'native-base';

import SideBar from './SideBar.js';
import NoteModal from './NoteModal';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isNoteOpen: false,
        };
    }

    componentWillMount() {
        const dirs = RNFetchBlob.fs.dirs;
        this.listFiles(dirs.DocumentDir)
            .then((files) => {
                // Check whether the 'Boostnote' folder be or not.
                const filteredFiles = files.filter((name) => {
                    return name === 'Boostnote';
                });
                // If not, create.
                if (filteredFiles.length === 0) {
                    this.createDir();
                }
                return this.listFiles(`${dirs.DocumentDir}/Boostnote`);
            })
            .then((files) => {
                // Check whether the folder has any files or not.

                if (files.length === 0) {
                    // If not, create.
                    // TODO change to correct file name
                    fs.createFile(`${dirs.DocumentDir}/Boostnote/test.md`, '# Welcome to Boostnote :)\nThis is a markdown note.', 'utf8')
                        .catch(err => console.log(err));
                }
                return this.listFiles(`${dirs.DocumentDir}/Boostnote`);
            })
            .then((files) => {
                console.log(files);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    openDrawer = () => {
        this._drawer._root.open();
    };

    setNoteModalIsOpen(isOpen) {
        this.setState({isNoteOpen: isOpen})
    }

    listFiles(dir) {
        return RNFetchBlob.fs.ls(dir);
    }

    createDir() {
        RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/Boostnote`)
            .then(() => {
                console.log('OK');
            })
            .catch((err) => {
                console.log('NG');
            });
    }

    createNewNote() {
        const dirs = RNFetchBlob.fs.dirs;
        alert(`${dirs.DocumentDir}/Boostnote`);
        fs.createFile(`${dirs.DocumentDir}/Boostnote`, '', 'utf8');
    }

    render() {
        return (
            <Drawer
                ref={(ref) => {
                    this._drawer = ref;
                }}
                content={<SideBar/>}
                panOpenMask={.05}>
                <Container>
                    <Header style={Platform.OS === 'android' ? {height: 70} : null}>
                        <Left style={Platform.OS === 'android' ? {top: 10} : null}>
                            <Button transparent onPress={this.openDrawer.bind(this)}>
                                <Icon name='menu'/>
                            </Button>
                        </Left>
                        <Body style={Platform.OS === 'android' ? {top: 10} : null}>
                        <Title>folder_name</Title>
                        </Body>
                        <Right style={Platform.OS === 'android' ? {top: 10} : null}>
                            <Button transparent>
                                <Icon name='search'/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>

                    </Content>
                    <Fab
                        active={true}
                        containerStyle={{ marginLeft: 10 }}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomRight"
                        onPress={() => this.createNewNote()}>
                        <Icon name="md-add" />
                    </Fab>
                    <NoteModal setIsOpen={this.setNoteModalIsOpen.bind(this)} isNoteOpen={this.state.isNoteOpen}/>
                </Container>
            </Drawer>
        );
    }
}