import React from 'react'
import {
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import Styles from './NoteInputSupportStyles'

import SvgUri from 'react-native-svg-uri'

import headIcon from '../../../resource/noteInputSupportIcons/icon-head'
import listIcon from '../../../resource/noteInputSupportIcons/icon-list'
import codeIcon from '../../../resource/noteInputSupportIcons/icon-code'
import boldIcon from '../../../resource/noteInputSupportIcons/icon-bold'
import italicIcon from '../../../resource/noteInputSupportIcons/icon-italic'
import quoteIcon from '../../../resource/noteInputSupportIcons/icon-quote'
import checkboxIcon from '../../../resource/noteInputSupportIcons/icon-checkbox'
import pasteIcon from '../../../resource/noteInputSupportIcons/icon-paste'

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
                svgXmlData={headIcon}
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
                svgXmlData={listIcon}
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
                svgXmlData={codeIcon}
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
                svgXmlData={checkboxIcon}
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
                svgXmlData={pasteIcon}
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
                svgXmlData={boldIcon}
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
                svgXmlData={quoteIcon}
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
                svgXmlData={italicIcon}
                style={Styles.supportImage}
              />
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }
}
