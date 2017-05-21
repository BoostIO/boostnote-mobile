import React from 'react';
import {Text} from 'react-native'
import {
    Container,
    List,
    ListItem,
} from 'native-base';

export default class SideBar extends React.Component {
    render() {
        return (
            <Container style={{
                flex:1,
                backgroundColor: 'white'
            }}>
                    <List style={{
                        flex:1,
                        top: 50,
                        left: 10,
                    }}>
                        <ListItem>
                            <Text>Boostnote mobile</Text>
                        </ListItem>
                        <ListItem>
                            <Text>All notes</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Starred</Text>
                        </ListItem>
                        <ListItem>
                            <Text>My storage</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Aaaaa</Text>
                        </ListItem>
                        <ListItem>
                            <Text>bbbbb</Text>
                        </ListItem>
                    </List>
            </Container>
        );
    }
}
