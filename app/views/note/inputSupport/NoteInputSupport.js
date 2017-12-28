import React from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} from 'react-native'
import Styles from './NoteInputSupportStyles'

import SvgUri from 'react-native-svg-uri'

import headIcon from '../../../resource/noteInputSupportIcons/icon-head.svg'
import listIcon from '../../../resource/noteInputSupportIcons/icon-list.svg'
import codeIcon from '../../../resource/noteInputSupportIcons/icon-code.svg'
import boldIcon from '../../../resource/noteInputSupportIcons/icon-bold.svg'
import italicIcon from '../../../resource/noteInputSupportIcons/icon-italic.svg'
import quoteIcon from '../../../resource/noteInputSupportIcons/icon-quote.svg'
import checkboxIcon from '../../../resource/noteInputSupportIcons/icon-checkbox.svg'
import pasteIcon from '../../../resource/noteInputSupportIcons/icon-paste.svg'


export default class NoteInputSupport extends React.Component {
  render() {
    return (
      <View style={Styles.inputSupportWrap} >
        <ScrollView horizontal={true} keyboardShouldPersistTaps='always'>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('#')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={headIcon}
              />
              <Text style={Styles.supportSub}>Head</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('- ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={listIcon}
              />
              <Text style={Styles.supportSub}>List</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('```\n')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={codeIcon}
              />
              <Text style={Styles.supportSub}>Code</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('**')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={boldIcon}
              />
              <Text style={Styles.supportSub}>Bold</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('_')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={italicIcon}
              />
              <Text style={Styles.supportSub}>italic</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('> ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={quoteIcon}
              />
              <Text style={Styles.supportSub}>Quote</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('- [ ] ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={checkboxIcon}
              />
              <Text style={Styles.supportSub}>TaskList</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.props.pasteContent.bind(this)}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                  width='10'
                  height='10'
                  source={pasteIcon}
              />
              <Text style={Styles.supportSub}>Paste</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}
