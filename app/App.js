import React, {Component} from 'react'
import {
    Text,
    Platform,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Icon,
    Drawer,
} from 'native-base'

import DropboxNoteList from './views/DropboxNoteList'

import SideBar from './components/SideBar'
import NoteModal from './views/note/NoteModal'
import NoteListItem from './components/NoteList/NoteListItem'

import AwsMobileAnalyticsConfig from './lib/AwsMobileAnalytics'
import { makeRandomHex } from './lib/Strings'

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const MARKDOWN_NOTE = "MARKDOWN_NOTE"
const SNIPPET_NOTE = "SNIPPET_NOTE"
const DEFAULT_FOLDER = "DEFAULT_FOLDER"

const styles = {
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
        color: '#FED530',
        fontSize: 21,
        marginRight: 6
    },
    newPostButtonWrap: {
        position: 'absolute',
        right: 30,
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
            mode: 0, // 0: 'AllNote', 1: 'Dropbox'
            noteList: [],
            fileName: '',
            content: '',
            filterFavorites: false,
        }

        // Init AwsMobileAnalytics
        AwsMobileAnalyticsConfig.initAwsMobileAnalytics();

        this.openDrawer = this.openDrawer.bind(this)
        this.closeDrawer = this.closeDrawer.bind(this)
        this.setNoteModalIsOpen = this.setNoteModalIsOpen.bind(this)
        this.onStarPress = this.onStarPress.bind(this)
        this.listDir = this.listDir.bind(this)
        this.listFiles = this.listFiles.bind(this)
        this.listFilesAndSetState = this.listFilesAndSetState.bind(this)
        this.createDir = this.createDir.bind(this)
        this.createNewNote = this.createNewNote.bind(this)
        this.changeMode = this.changeMode.bind(this)
        this.onFilterFavorites = this.onFilterFavorites.bind(this)
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

    closeDrawer = () => {
        this._drawer._root.close()
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
            AwsMobileAnalyticsConfig.recordDynamicCustomEvent('EDIT_NOTE')
            this.listFilesAndSetState()
            this.setState({
                isNoteOpen: false
            })
        }
    }

    onStarPress(fileName) {
        fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')
            .then((content) => {
                let contentObject = JSON.parse(content)
                const newNotes = []
                for (i in contentObject.note) {
                    const newNote = {...contentObject.note[i]}
                    if (newNote.name === fileName) {
                        newNote.isStarred = !newNote.isStarred
                    }
                    newNotes.push(newNote)
                }
                contentObject.note = newNotes
                fs.writeFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, JSON.stringify(contentObject), 'utf8')
                    .then(this.listFilesAndSetState)
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    onFilterFavorites() {
        this.setState((prevState, props) => {
            return {filterFavorites: !prevState.filterFavorites}
        })
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`)
    }

    listFiles() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/Boostnote`)
    }

    async listFilesAndSetState() {
        const files = await this.listFiles()
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
                createdAt: filteredSettingFile.createdAt,
                isStarred: filteredSettingFile.isStarred
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
                AwsMobileAnalyticsConfig.recordDynamicCustomEvent('CREATE_NOTE')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    changeMode(mode) {
        this.setState({
            mode: mode
        })
    }

    render() {
        const { noteList, mode, filterFavorites, isNoteOpen, fileName, content } = this.state
        return (
            <Drawer
                ref={(ref) => {
                    this._drawer = ref
                }}
                content={
                    <SideBar
                        changeMode={this.changeMode}
                        onClose={() => this.closeDrawer()}/>
                }
                panOpenMask={.05}>
                <Container>
                    <Header style={Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader} androidStatusBarColor='#239F85'>
                        <Left style={Platform.OS === 'android' ? {top: 10} : null}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Button transparent onPress={this.openDrawer}>
                                    <Icon name='md-list' style={styles.headerMenuButton}/>
                                </Button>
                                <Title style={styles.appName}>Boostnote</Title>
                            </View>
                        </Left>
                        <Right style={Platform.OS === 'android' ? {top: 10} : null}>
                            <TouchableOpacity onPress={this.onFilterFavorites}>
                                <Icon name= {filterFavorites ? 'md-star' : 'md-star-outline'} style={styles.headerRightMenuButton}/>
                            </TouchableOpacity>
                            {/* <Icon name='md-search' style={styles.headerRightMenuButton}/> */}
                        </Right>
                    </Header>
                    <Content contentContainerStyle={{ display: 'flex' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexDirection: 'row', width: '100%', height: 40, backgroundColor: '#F3F4F4'}}>
                            <Text style={{backgroundColor: 'transparent', position: 'absolute', left: 10, top:12, color: 'rgba(40,44,52,0.4)', fontSize: 13, fontWeight: '600'}}>
                                {
                                    mode === 0
                                        ? 'All Notes'
                                        : 'Dropbox'
                                }
                            </Text>
                            {/*<View style={{backgroundColor: 'transparent', position: 'absolute', right: 10, marginTop: 11}}>
                                <Text style={{color: 'rgba(40,44,52,0.4)', fontSize: 13, fontWeight: '600'}}>Sort by Created  <Icon name='md-flash' style={{color: '#FDC134', fontSize: 14, fontWeight: '600'}} /></Text>
                            </View>*/}
                        </View>
                        {
                            mode === 0 ? noteList.map((note) => {
                                if (filterFavorites &&  !note.isStarred) return null
                                return <NoteListItem note={note} onStarPress={this.onStarPress} onNotePress={this.setNoteModalIsOpen} key={note.fileName} />
                            }) : <DropboxNoteList/>
                        }
                    </Content>
                    {
                        mode === 0 ?
                            <View>
                                <Button
                                    transparent
                                    onPress={() => this.createNewNote('', true)}
                                    style={styles.newPostButtonWrap}>
                                    <View style={styles.newPostButton}>
                                        <Icon name='md-create' style={{color: "#fff"}}/>
                                    </View>
                                </Button>
                                <NoteModal setIsOpen={this.setNoteModalIsOpen}
                                       isNoteOpen={isNoteOpen}
                                       fileName={fileName}
                                       content={content}/>
                            </View>
                        : null
                    }
                </Container>
            </Drawer>
        )
    }
}
