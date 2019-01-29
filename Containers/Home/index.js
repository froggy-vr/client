import React, { Component } from 'react';
import { AppRegistry, Linking, TouchableOpacity,StyleSheet, Text, TextInput, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import firebase from 'react-native-firebase'


export default class Home extends Component {
  state = {
    gameId: 'user123',
  }

  startGame = () => {
    firebase.database().ref(`/${this.state.gameId}/connected`).set(true)
      .then(() => {
        this.props.navigation.navigate('GameController', { gameId: this.state.gameId })
      })
  }
  
  handleTextInputChange = gameId => {
    this.setState({ gameId: gameId || 'user123' }) 
  }
  
  qrOnSuccess = (e) =>  {
    this.setState({gameId: e.data}, () => {
      this.startGame()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.qrOnSuccess}
          topContent={
            <Text style={styles.centerText}>
              Scan The Barcode To Start The Game
            </Text>
          }
        />
        <TextInput
          style={styles.gameInput}
          placeholder="Insert game id"
          onChangeText={this.handleTextInputChange}
        />
        <TouchableOpacity style={styles.startButton} onPress={this.startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 30
  },
  gameInput: {
    borderRadius: 10,
    width: 250,
    textAlign: "center",
    marginBottom: 30,
    backgroundColor: "#A9A9A9"
  },
  startButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    backgroundColor: '#1D3461',
    borderRadius: 30
  },
  startButtonText: {
    color: 'white'
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#ffffff',
  },
});

AppRegistry.registerComponent('default', () => Home);