import React, { Component } from 'react';
import {
	Text,
	View,
	Platform,
	TouchableOpacity,
} from 'react-native'

import { 
	Icon,
	ActionSheet,
} from 'native-base'

import moment from 'moment'
import removeMd from 'remove-markdown-and-html'
import Swipeout from 'react-native-swipeout';

import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs

const styles = {
	noteList: {
		width: '100%',
		height: 65,
		marginTop: 0,
		marginBottom: 0,
		borderColor: '#F7F7F7',
		borderBottomWidth: 1,
		backgroundColor: 'rgba(244,244,244,0.1)',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15
	},
	noteStarIcon: {
		fontSize: 21,
		color: 'gold',
		paddingLeft: 15,
	},
	noteListIconWrap: {
		backgroundColor: '#eeeeee',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 30,
		height: 30,
		borderRadius: 50,
		overflow: 'hidden'
	},
	noteListIcon: {
		fontSize: 14,
		color: '#adadad'
	},
	noteListText: {
		color: '#3a3941',
		backgroundColor: 'transparent',
		fontSize: 14,
		flex: 1,
		paddingLeft: 10
	},
	noteListTextNone: {
		color: '#adadad',
		backgroundColor: 'transparent',
		fontSize: 14,
		flex: 1
	},
	noteListDate: {
		color: 'rgba(40,44,52,0.4)',
		fontSize: 13,
		fontWeight: '600',
	},
	noteItemSectionLeft: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 2,
	},
	noteItemSectionRight: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}
}

class NoteListItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			fileName: this.props.fileName
		}
		this.onNotePress = this.onNotePress.bind(this)
		this.onStarPress = this.onStarPress.bind(this)
	}

	componentWillReceiveProps(props) {
		// if user is opening a same file, set state.
		if (props.fileName === this.state.fileName) {
				return
		}

		// if user open an another file, set state.
		this.setState({
				fileName: props.fileName,
		})
}

	onNotePress() {
		const { note, onNotePress } = this.props || {}
		const { fileName } = note || {}

		onNotePress(fileName, true);
	}

	onStarPress() {
		const { note, onStarPress } = this.props || {}
		const { fileName } = note || {}

		onStarPress(fileName)
	}

	CustomeNote(){ 
		ActionSheet.show(
			{
					options: ["Delete", "Cancel"],
					cancelButtonIndex: 1,
					destructiveButtonIndex: 0,
			},
		buttonIndex => {
				// `buttonIndex` is a string in Android, a number in iOS.
				if (Platform.OS === 'android' && buttonIndex === '0'
						|| Platform.OS === 'ios' && buttonIndex === 0) {
						fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/Boostnote/${this.state.fileName}`)
						.then(() => {
								this.props.setIsOpen('', false)
						})
				}
		}
	)}

	render() {

		let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'rgba(205,53,54,0.8);',
      onPress: () => { this.CustomeNote() }
    }];

		const { note } = this.props || {}
		const { content, createdAt, isStarred } = note || {}
		return (
			<Swipeout right={swipeBtns}
				autoClose= {true}
				backgroundColor= 'transparent'>
				<TouchableOpacity
					style={styles.noteList}
					onPress={this.onNotePress}>
					<View style={styles.noteItemSectionLeft}>
						<Text style={content !== 'Tap here and write something!' ? styles.noteListText : styles.noteListTextNone}>{removeMd(content)}</Text>
					</View>
					<View style={styles.noteItemSectionRight}>
						<Text style={styles.noteListDate}>{moment(createdAt).format('MMM D')}</Text>
						<TouchableOpacity onPress={this.onStarPress}>
							<Icon name={isStarred ? "md-star" : "md-star-outline"} style={styles.noteStarIcon}/>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Swipeout>
		)
	}

}

export default NoteListItem;
