import React from 'react'

import {
  View,
  Text
} from 'react-native'

import CheckBox from 'react-native-check-box'
import Markdown, {PluginContainer, stringToTokens, MarkdownIt} from 'react-native-markdown-renderer'
import markdownItCheckbox from 'markdown-it-checkbox'

export default class NotePreview extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      text: this.props.text,
      taskListLinesFromMarkdown: this.createTaskListLine(props.text),
      taskListIdsFromCheckbox: []
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      text: props.text,
      taskListLinesFromMarkdown: this.createTaskListLine(props.text),
      taskListIdsFromCheckbox: []
    })
  }

  hasParents(parents, type) {
    return parents.findIndex(el => el.type === type) > -1;
  }

  createTaskListLine(text) {
    return stringToTokens(text, MarkdownIt().use(markdownItCheckbox))
      .filter(token => token.type === 'inline')
      .filter(token => token.children[0] && token.children[0].type === 'checkbox_input')
      .map(token => token.map[0])
  }

  render() {
    return (
      <View style={{ margin: 15 }}>
        <Markdown
          plugins={[new PluginContainer(markdownItCheckbox)]}
          rules={{
            li: (node, children, parent, styles) => {
              if (this.hasParents(parent, 'ul')) {

                // For tasklist
                if (node.children[0] && node.children[0].type === 'p' && node.children[0].children[0] && node.children[0].children[0].type === 'input') {
                  return (
                    <View key={node.key} style={styles.listUnorderedItem}>
                      <View style={[styles.listItem]}>
                        {children}
                      </View>
                    </View>
                  );
                }

                return (
                  <View key={node.key} style={styles.listUnorderedItem}>
                    <Text style={styles.listUnorderedItemIcon}>
                      {'\u00B7'}
                    </Text>
                    <View style={[styles.listItem]}>
                      {children}
                    </View>
                  </View>
                );
              }

              if (this.hasParents(parent, 'ol')) {
                return (
                  <View key={node.key} style={styles.listOrderedItem}>
                    <Text style={styles.listOrderedItemIcon}>
                      {node.index + 1}
                    </Text>
                    <View style={[styles.listItem]}>
                      {children}
                    </View>
                  </View>
                );
              }

              return (
                <View key={node.key} style={[styles.listItem]}>
                  {children}
                </View>
              );
            },
            label: (node, children, parents) => {
              return children
            },
            input: (node, children, parents) => {
              this.state.taskListIdsFromCheckbox.push(node.attributes.id)

              return <CheckBox
                key={node.key}
                onClick={() => {
                  const i = this.state.taskListIdsFromCheckbox
                    .slice(-this.state.taskListLinesFromMarkdown.length)
                    .findIndex((element, index, array) => element === node.attributes.id)
                  this.props.onTapCheckBox(this.state.taskListLinesFromMarkdown[i])
                }}
                isChecked={!!node.attributes.checked}
                isIndeterminate={false}/>
            }
          }}
          children={this.state.text}
        />
      </View>
    )
  }
}
