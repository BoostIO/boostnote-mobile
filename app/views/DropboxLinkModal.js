import React from 'react'
import {
    Platform,
    Modal,
    Text,
    TextInput,
    WebView,
    Alert,
    AsyncStorage,
} from 'react-native'
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Icon,
    View,
} from 'native-base'

import settings from '../config/settings'

const DROPBOX_ACCESS_TOKEN = 'DROPBOX:ACCESS_TOKEN'

export default class WebViewModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            code: '',
        }
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.props.isWebViewOpen}
                onRequestClose={() => {
                }}>
                <Container>
                    <Header style={Platform.OS === 'android' ? {height: 47,backgroundColor: '#6C81A6'} : {backgroundColor: '#6C81A6'}} androidStatusBarColor='#239F85'>
                        <Left style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => this.props.setIsWebViewOpen(false)}>
                                <Text><Icon name='md-close' style={{color: '#EFF1F5', fontSize: 23}}/></Text>
                            </Button>
                        </Left>
                    </Header>
                    <Content contentContainerStyle={{flex: 1}}>
                        <WebView
                            source={{uri: `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${settings.dropboxClientId}`}}
                            injectedJavaScript={`document.getElementById('auth-code')?document.getElementById('auth-code').childNodes[0].removeAttribute('readonly'):''`}
                            style={{marginTop: 20}}
                            startInLoadingState={true}
                        />
                        <View style={{height: 50, marginLeft: 20, marginRight: 20, flexDirection: 'row'}}>
                            <TextInput
                                style={{flex:5, height: 35, marginRight: 10, paddingLeft: 5, borderColor: '#F3F4F4', borderWidth: 1}}
                                placeholder={'Input code here!'}
                                onChangeText={(text) => this.setState({code: text})}
                            />
                            <Button
                                style={{flex:1, backgroundColor: '#F3F4F4', height: 35, width: 35,}}
                                onPress={() => {
                                    fetch(`https://api.dropboxapi.com/oauth2/token?code=${this.state.code}&grant_type=authorization_code&client_id=${settings.dropboxClientId}&client_secret=${settings.dropboxClientSecret}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        }
                                    })
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error()
                                        }
                                        return response.json()
                                    })
                                    .then((response) => {
                                        AsyncStorage.setItem(DROPBOX_ACCESS_TOKEN, response.access_token)
                                        .then((values) => {
                                            this.props.onGetTokenSuccess()
                                            this.props.setIsWebViewOpen(false)
                                        })
                                        .catch((e) => {
                                            Alert.alert(
                                                'Something wrong',
                                                'Please retry',
                                                [
                                                    {text: 'OK'},
                                                ],
                                                { cancelable: false }
                                            )
                                        })
                                    })
                                    .catch((e) => {
                                        Alert.alert(
                                            'Cannot authorize',
                                            'Please input a valid token',
                                            [
                                                {text: 'OK'},
                                            ],
                                            { cancelable: false }
                                        )
                                    })
                                }}>
                                <Text>Send!</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            </Modal>
        )
    }
}
