import React from 'react'

import {
  View,
} from 'react-native'

import Styles from './NotePreviewStyles'
import createMarkdownRenderer from 'rn-markdown'

const Markdown = createMarkdownRenderer({ gfm: true, tables: true })

export default class NotePreview extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      text: this.props.text,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      text: props.content,
    })
  }

  render() {
    return (
      <View style={{ margin: 15 }}>
        <Markdown contentContainerStyle={Styles.container} markdownStyles={Styles.markdownStyles}>
          {this.props.text}
        </Markdown>
      </View>
    )
  }
}
