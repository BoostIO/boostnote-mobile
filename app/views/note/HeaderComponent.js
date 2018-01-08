import React from 'react'
import {
  Text,
  Platform,
  View
} from 'react-native'
import {
  Header,
  Left,
  Right,
  Button,
  Root,
  Icon
} from 'native-base'
import styles from './NoteModalStyle'

const HeaderLeft = ({setIsOpen, folderName}) => (
  <Left style={Platform.OS === 'android' ? {top: 0} : null}>
    <Button transparent onPress={() => setIsOpen('', false)}>
      <Text><Icon name='ios-arrow-back' style={styles.noteDetailButton} /></Text>
      <Text style={styles.backHomeText}>{folderName}</Text>
    </Button>
  </Left>
)

const HeaderRight = ({handleSwitchEditButtonClick, isEditting, handlePressDetailButton}) => (
  <Right style={Platform.OS === 'android' ? {top: 0} : {top: 3}}>
    <View>
      <Root>
        <Button transparent
          style={styles.switchEditButton}
          onPress={handleSwitchEditButtonClick.bind(this)}>
          <Text style={styles.switchEditText}>
            {isEditting ? 'Save' : 'Edit'}
          </Text>
        </Button>
        <Button transparent onPress={handlePressDetailButton}>
          <Text><Icon name='ios-more' style={styles.noteDetailButton} /></Text>
        </Button>
      </Root>
    </View>
  </Right>
)

const HeaderComponent = ({setIsOpen, folderName, handleSwitchEditButtonClick, isEditting, handlePressDetailButton}) => (
  <Header style={Platform.OS === 'android'
    ? {height: 47, backgroundColor: '#f9f9f9'}
    : {backgroundColor: '#f9f9f9'}} androidStatusBarColor='#239F85'>
    <HeaderLeft setIsOpen={setIsOpen}
      folderName={folderName} />
    <HeaderRight handleSwitchEditButtonClick={handleSwitchEditButtonClick}
      isEditting={isEditting}
      handlePressDetailButton={handlePressDetailButton} />
  </Header>
)

export default HeaderComponent
