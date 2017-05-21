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
} from 'native-base';

import SideBar from './SideBar.js';
import NoteModal from './NoteModal';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isNoteOpen: false,
        };
    }

    componentWillMount() {}

    openDrawer = () => {
        this._drawer._root.open();
    };

    setNoteModalIsOpen(isOpen) {
        this.setState({isNoteOpen: isOpen})
    }

    render() {
        return (
            <Drawer
                ref={(ref) => {
                    this._drawer = ref;
                }}
                content={<SideBar/>}
                panOpenMask={.75}>
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
                        <Card>
                            <CardItem button onPress={() => this.setNoteModalIsOpen(true)}>
                                <Body>
                                <Text>aaaaaaaaaaa</Text>
                                </Body>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card><Card>
                        <CardItem>
                            <Body>
                            <Text>aaaaaaaaaaa</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        <Card>
                            <CardItem>
                                <Body>
                                <Text>bbbbbbbbbbbbb</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                    <NoteModal setIsOpen={this.setNoteModalIsOpen.bind(this)} isNoteOpen={this.state.isNoteOpen}/>
                </Container>
            </Drawer>
        );
    }
}