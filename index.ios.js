/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import App from './app/App';
import {
    AppRegistry,
} from 'react-native';

export default class boostnotemobile extends Component {
    render() {
        return (
            <App/>
        );
    }
}

AppRegistry.registerComponent('boostnotemobile', () => boostnotemobile);
