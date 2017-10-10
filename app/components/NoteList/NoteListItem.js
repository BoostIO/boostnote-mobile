import React, { Component } from 'react';
import {
	Text,
    View,
	TouchableOpacity,
} from 'react-native'
import { Icon, Card, Left, Right } from 'native-base'
import moment from 'moment'
import removeMd from 'remove-markdown-and-html'

const styles = {
	noteListWrap: {
		marginTop: 0,
		marginBottom: 0,
		borderColor: '#F7F7F7',
		borderBottomWidth: 1
	},
	noteList: {
		width: '100%',
		height: 65,
		backgroundColor: 'rgba(244,244,244,0.1)',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10
	},
	noteStarIcon: {
		fontSize: 13,
		color: 'gold',
		flex: 1
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
		flex: 1
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
		flex: 1,
	},
	noteItemSectionLeft: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
	},
	noteItemSectionRight: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}
}

class NoteListItem extends Component {
	render() {
		const { note, onItemPress, onStarPress } = this.props || {}
		const { fileName, content, createdAt, isStarred } = note || {}
		return (
			<Card transparent style={styles.noteListWrap}>
				<TouchableOpacity
					style={styles.noteList}
					onPress={() => onItemPress(fileName, true)}>
					<View style={styles.noteItemSectionLeft}>
						<View style={styles.noteListIconWrap}>
							<Icon name='md-code-working' style={styles.noteListIcon}/>
						</View>
						<Text style={content !== 'Tap here and write something!' ? styles.noteListText : styles.noteListTextNone}>{removeMd(content)}</Text>
					</View>
					<View style={styles.noteItemSectionRight}>
						<Text style={styles.noteListDate}>{moment(createdAt).format('MMM D')}</Text>
						<TouchableOpacity onPress={() => onStarPress(fileName)}>
							<Icon name={isStarred ? "md-star" : "md-star-outline"} style={styles.noteStarIcon}/>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Card>
		)
	}

}

export default NoteListItem;
