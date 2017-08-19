import React, {Component} from 'react';
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
const dirs = RNFetchBlob.fs.dirs;

const MARKDOWN_NOTE = "MARKDOWN_NOTE";
const SNIPPET_NOTE = "SNIPPET_NOTE";
const DEFAULT_FOLDER = "DEFAULT_FOLDER";

const styles = {
    noteList: {
        width: '100%',
        height: 65,
        backgroundColor: '#ffffff',
    },
    iosHeader: {
        backgroundColor: '#1abc9c',
    },
    appName: {
        color: '#ffffff',
        marginLeft: -160
    },
    headerMenuButton: {
        color: '#ffffff'
    },
    noteListIconWrap: {
        backgroundColor: '#eeeeee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 50,
        overflow: 'hidden'
    },
    noteListIcon: {
        fontSize: 14
    },
    noteListText: {
        color: '#282C34',
        fontSize: 14,
        width: '100%'
    },
    noteListTextNone: {
        color: '#adadad'
    },
    newPostButtonWrap: {
        marginLeft: '43%',
        marginBottom: 30,
        shadowOffset:{
            width: 0,
            height: 4,
        },
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6
    },
    newPostButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D15419',
        width: 60,
        height: 60,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
    }
}

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isNoteOpen: false,
            noteList: [],
            fileName: '',
            content: '',
        };
    }

    makeRandomHex() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    componentWillMount() {
        this.listDir(dirs.DocumentDir)
            .then((files) => {
                // Check whether the 'Boostnote' folder exist or not.
                const filteredFiles = files.filter((name) => {
                    return name === 'Boostnote';
                });
                // If not, create.
                if (filteredFiles.length === 0) {
                    this.createDir();
                }
                return this.listFiles();
            })
            .then((files) => {
                const filteredFiles = files.filter((name) => {
                    return name === 'boostnote.json';
                });
                // Check whether the folder has a setting file or not.
                if (filteredFiles.length === 0) {
                    // If not, create.
                    const defaultJson = {
                        note: []
                    };
                    fs.createFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(defaultJson), 'utf8')
                        .catch(err => console.log(err));
                }
                return this.listFiles();
            })
            .then((files) => {
                const filteredFiles = files.filter((name) => {
                    return name.endsWith('.md');
                });
                // Check whether the folder has any note files or not.
                if (filteredFiles.length === 0) {
                    // If not, create.
                    this.createNewNote(`${this.makeRandomHex()}.md`);
                }
                return this.listFilesAndSetState();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    openDrawer = () => {
        this._drawer._root.open();
    };

    setNoteModalIsOpen(fileName, isOpen) {
        this.listFilesAndSetState();
        fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8')
            .then((content) => {
                this.setState({
                    fileName: fileName,
                    content: content,
                    isNoteOpen: isOpen
                });
            });
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`);
    }

    listFiles() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/Boostnote`);
    }

    async listFilesAndSetState() {
        const files = await this.listFiles(`${dirs.DocumentDir}/Boostnote`);
        const filteredFiles = files.filter((name) => {
            return name.endsWith('.md');
        });

        // Change file name to object of file name and one liner content
        let fileList = [];
        for (let i = 0; i < filteredFiles.length; i++) {
            const fileName = filteredFiles[i];
            const content = await fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8');
            fileList.push({
                fileName: fileName,
                content: content === '' ? 'Tap here and write something!' : content.split(/\r\n|\r|\n/)[0]
            });
        }

        this.setState({
            noteList: fileList,
        });
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

    createNewNote(fileName) {
        const newFileName = fileName === '' ? `${this.makeRandomHex()}.md` : fileName;

        // Create a real file
        fs.createFile(`${dirs.DocumentDir}/Boostnote/${newFileName}`, '', 'utf8')
            .then((file) => {
                // Update setting file
                return fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')
            })
            .then((content) => {
                let contentObject = JSON.parse(content);
                const date = new Date();
                const thisNote = {
                    "type": MARKDOWN_NOTE,
                    "folder": DEFAULT_FOLDER,
                    "title": "",
                    "name": newFileName,
                    "isStarred": false,
                    "createdAt": date,
                    "updatedAt": date
                };
                contentObject.note.push(thisNote);
                console.table(contentObject.note);
                fs.createFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(contentObject), 'utf8')
                    .catch(err => console.log(err));
            })
            .catch((err) => {
                console.log(err);
            });
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
                    <Header style={Platform.OS === 'android' ? {height: 70} : styles.iosHeader}>
                        <Left style={Platform.OS === 'android' ? {top: 10} : null}>
                            <Button transparent onPress={this.openDrawer.bind(this)}>
                                <Icon name='menu' style={styles.headerMenuButton}/>
                            </Button>
                        </Left>
                        <Body style={Platform.OS === 'android' ? {top: 10} : null}>
                        <Title style={styles.appName}>Boostnote</Title>
                        </Body>
                        <Right style={Platform.OS === 'android' ? {top: 10} : null}>
                            <Button transparent>
                                <Icon name='star' style={styles.headerMenuButton}/>
                            </Button>
                            <Button transparent>
                                <Icon name='search' style={styles.headerMenuButton}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {
                            this.state.noteList.map((note) => {
                                return <Card key={note.fileName}>
                                    <CardItem
                                        style={styles.noteList}
                                        button onPress={() => this.setNoteModalIsOpen(note.fileName, true)}>
                                        <Body>
                                            <Text numberOfLines={1} style={note.content !== 'Tap here and write something!' ? styles.noteListText : styles.noteListTextNone}>
                                                <View style={styles.noteListIconWrap}>
                                                    <Icon name='paper' style={styles.noteListIcon}/>
                                                </View>
                                                {note.content}
                                                <Text style={styles.noteListDate}>Jul 29</Text>
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>;
                            })
                        }
                    </Content>
                    <Button transparent 
                        onPress={() => {
                            this.createNewNote('');
                            this.listFilesAndSetState();
                        }}
                        style={styles.newPostButtonWrap}
                    >
                        <View style={styles.newPostButton}>
                            <Icon name='md-add' style={{color: "#fff"}}/>
                        </View>
                    </Button>
                    {/*<Fab
                        active={true}
                        containerStyle={{marginLeft: 10}}
                        style={styles.newNoteButton}
                        position="bottomRight"
                        onPress={() => {
                            this.createNewNote('');
                            this.listFilesAndSetState();
                        }
                        }>
                        <Icon name="md-add"/>
                    </Fab>*/}
                    <NoteModal setIsOpen={this.setNoteModalIsOpen.bind(this)}
                               isNoteOpen={this.state.isNoteOpen}
                               fileName={this.state.fileName}
                               content={this.state.content}/>
                </Container>
            </Drawer>
        );
    }
}