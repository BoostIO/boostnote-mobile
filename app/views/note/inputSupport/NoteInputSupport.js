import React from 'react'
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native'
import Styles from './NoteInputSupportStyles'

export default class NoteInputSupport extends React.Component {
  render() {
    return (
      <View style={Styles.inputSupportWrap}>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('#')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>#</Text>
            <Text style={Styles.supportSub}>Head</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('- ')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>-</Text>
            <Text style={Styles.supportSub}>List</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('```\n')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>```</Text>
            <Text style={Styles.supportSub}>Code</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('**')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>**</Text>
            <Text style={Styles.supportSub}>Bold</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('_')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>_</Text>
            <Text style={Styles.supportSub}>italic</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            this.props.insertMarkdownBetween('> ')
          }}
          style={Styles.inputElementsStyle}>
          <View>
            <Text style={Styles.supportMain}>&gt;</Text>
            <Text style={Styles.supportSub}>Quote</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.props.pasteContent.bind(this)}
          style={Styles.inputElementsStyle}>
          <Text style={Styles.pasteButton}>Paste</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
