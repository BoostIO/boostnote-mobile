import React from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  ScrollView
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
  render () {
    return (
      <View style={Styles.inputSupportWrap} >
        <ScrollView horizontal keyboardShouldPersistTaps='always'>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('#')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={headIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('- ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={listIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('```\n')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={codeIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('- [ ] ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={checkboxIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.props.pasteContent.bind(this)}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={pasteIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('**')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={boldIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('> ')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={quoteIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('_')
            }}
            style={Styles.inputElementsStyle}>
            <View>
              <SvgUri
                width='17'
                height='17'
                source={italicIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}
