import React, {Component} from 'react'
import {
    Text,
    Platform,
    Modal,
    View,
    TextInput
} from 'react-native'
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
} from 'native-base'

import FontAwesome, { Icons } from 'react-native-fontawesome'

import moment from 'moment'
import removeMd from 'remove-markdown-and-html'

import SideBar from './components/SideBar'
import NoteModal from './views/NoteModal'

import AwsMobileAnalyticsConfig from './lib/AwsMobileAnalytics'
import { makeRandomHex } from './lib/Strings'

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const MARKDOWN_NOTE = "MARKDOWN_NOTE"
const SNIPPET_NOTE = "SNIPPET_NOTE"
const DEFAULT_FOLDER = "DEFAULT_FOLDER"

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
        backgroundColor: 'rgba(244,244,244,0.1)',
    },
    iosHeader: {
        backgroundColor: '#239F85',
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
    noteListIconWrap: {
        backgroundColor: '#eeeeee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 50,
        overflow: 'hidden',
        marginTop: 9
    },
    noteListIcon: {
        fontSize: 14,
        color: '#adadad'
    },
    noteListText: {
        position: 'absolute',
        color: '#3a3941',
        backgroundColor: 'transparent',
        top: 15,
        fontSize: 14,
        width: '73%',
        marginLeft: 40
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
    newPostButtonWrap: {
        position: 'absolute',
        marginLeft: '43%',
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 50,
        shadowOffset:{
            width: 0,
            height: 3,
        },
        shadowColor: '#CF5425',
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    noteListDate: {
        position: 'absolute',
        color: 'rgba(40,44,52,0.4)',
        fontSize: 13,
        top: 15,
        right: 0,
        fontWeight: '600'
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
        super()
        this.state = {
            isNoteOpen: false,
            noteList: [],
            fileName: '',
            content: '',
        }
    }

    componentWillMount() {
        this.listDir(dirs.DocumentDir)
            .then((files) => {
                // Check whether the 'Boostnote' folder exist or not.
                const filteredFiles = files.filter((name) => {
                    return name === 'Boostnote'
                })
                // If not, create.
                if (filteredFiles.length === 0) {
                    this.createDir()
                }
                return this.listFiles()
            })
            .then((files) => {
                const filteredFiles = files.filter((name) => {
                    return name === 'boostnote.json'
                })
                // Check whether the folder has a setting file or not.
                if (filteredFiles.length === 0) {
                    // If not, create.
                    const defaultJson = {
                        note: []
                    }
                    fs.createFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(defaultJson), 'utf8')
                        .catch(err => console.log(err))
                }
                return this.listFiles()
            })
            .then((files) => {
                const filteredFiles = files.filter((name) => {
                    return name.endsWith('.md')
                })
                // Check whether the folder has any note files or not.
                if (filteredFiles.length === 0) {
                    // If not, create.
                    this.createNewNote(`${makeRandomHex()}.md`)
                }
                return this.listFilesAndSetState()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    openDrawer = () => {
        this._drawer._root.open()
    }

    setNoteModalIsOpen(fileName, isOpen) {
        if (isOpen) {
            fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8')
                .then((content) => {
                    this.setState({
                        fileName: fileName,
                        content: content,
                        isNoteOpen: true
                    })

                })
        } else {
            AwsMobileAnalyticsConfig.recordDynamitCustomEvent('EDIT_NOTE')
            this.listFilesAndSetState()
            this.setState({
                isNoteOpen: false
            })
        }
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`)
    }

    listFiles() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/Boostnote`)
    }

    async listFilesAndSetState() {
        const files = await this.listFiles(`${dirs.DocumentDir}/Boostnote`)
        const filteredFiles = files.filter((name) => {
            return name.endsWith('.md')
        })

        let settingJsonFile = await fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')

        // Change file name to object of file name and one liner content
        let fileList = []
        for (let i = 0; i < filteredFiles.length; i++) {
            const fileName = filteredFiles[i]
            const content = await fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8')
            let filteredSettingFile = JSON.parse(settingJsonFile).note.filter(setting => {
                return setting.name === fileName
            })[0]
            fileList.push({
                fileName: fileName,
                content: content === '' ? 'Tap here and write something!' : content.split(/\r\n|\r|\n/)[0],
                createdAt: filteredSettingFile.createdAt
            })
        }
        fileList.sort((a, b) => {
            return a.createdAt < b.createdAt ? 1 : -1
        })

        this.setState({
            noteList: fileList,
        })
    }

    createDir() {
        RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/Boostnote`)
            .then(() => {
                console.log('OK')
            })
            .catch((err) => {
                console.log('NG')
            })
    }

    createNewNote(fileName, isOpen) {
        const newFileName = fileName === '' ? `${makeRandomHex()}.md` : fileName

        // Create a real file
        fs.createFile(`${dirs.DocumentDir}/Boostnote/${newFileName}`, '', 'utf8')
            .then((file) => {
                this.setState({
                    isNoteOpen: isOpen,
                    fileName: newFileName,
                    content: ''
                })
                // Update setting file
                return fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')
            })
            .then((content) => {
                let contentObject = JSON.parse(content)
                const date = new Date()
                const thisNote = {
                    "type": MARKDOWN_NOTE,
                    "folder": DEFAULT_FOLDER,
                    "title": "",
                    "name": newFileName,
                    "isStarred": false,
                    "createdAt": date,
                    "updatedAt": date
                }
                contentObject.note.push(thisNote)
                console.table(contentObject.note)
                fs.writeFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(contentObject), 'utf8')
                    .catch(err => console.log(err))
                AwsMobileAnalyticsConfig.recordDynamitCustomEvent('CREATE_NOTE')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <Drawer
                ref={(ref) => {
                    this._drawer = ref
                }}
                content={<SideBar/>}
                panOpenMask={.05}>
                <Container>
                    <Header style={Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader} androidStatusBarColor='#239F85'>
                        <Left style={Platform.OS === 'android' ? {top: 10} : null}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Button transparent onPress={this.openDrawer.bind(this)}>
                                    <Icon name='md-list' style={styles.headerMenuButton}/>
                                </Button>
                                <Title style={styles.appName}>Boostnote</Title>
                            </View>
                        </Left>
                        {/*<Right style={Platform.OS === 'android' ? {top: 10} : null}>
                            <Icon name='md-star' style={styles.headerRightMenuButton}/>
                            <Icon name='md-search' style={styles.headerRightMenuButton}/>
                        </Right>*/}
                    </Header>
                    <Content>
                        <View style={{flex: 1, flexDirection: 'row', width: '100%', height: 40, backgroundColor: '#F3F4F4'}}>
                            <Text style={{backgroundColor: 'transparent', position: 'absolute', left: 10, top:12, color: 'rgba(40,44,52,0.4)', fontSize: 13, fontWeight: '600'}}>All Notes</Text>
                            {/*<View style={{backgroundColor: 'transparent', position: 'absolute', right: 10, marginTop: 11}}>
                                <Text style={{color: 'rgba(40,44,52,0.4)', fontSize: 13, fontWeight: '600'}}>Sort by Created  <Icon name='md-flash' style={{color: '#FDC134', fontSize: 14, fontWeight: '600'}} /></Text>
                            </View>*/}
                        </View>
                        {
                            this.state.noteList.map((note) => {
                                return <Card transparent key={note.fileName} style={styles.noteListWrap}>
                                    <CardItem
                                        style={styles.noteList}
                                        button onPress={() => this.setNoteModalIsOpen(note.fileName, true)}>
                                        <Body>
                                            <View style={styles.noteListIconWrap}>
                                                <Icon name='md-code-working' style={styles.noteListIcon}/>
                                            </View>
                                            <Text numberOfLines={1} style={note.content !== 'Tap here and write something!' ? styles.noteListText : styles.noteListTextNone}>{removeMd(note.content)}</Text>
                                            <Text style={styles.noteListDate}>{moment(note.createdAt).format('MMM D')}</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            })
                        }
                    </Content>

                    <Button transparent
                        onPress={() => {
                            this.createNewNote('', true)
                        }}
                        style={styles.newPostButtonWrap}
                    >
                        <View style={styles.newPostButton}>
                            <Icon name='md-create' style={{color: "#fff"}}/>
                        </View>
                    </Button>

                    <NoteModal setIsOpen={this.setNoteModalIsOpen.bind(this)}
                               isNoteOpen={this.state.isNoteOpen}
                               fileName={this.state.fileName}
                               content={this.state.content}/>
                </Container>
            </Drawer>
        )
    }
}
