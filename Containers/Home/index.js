import React, { Component } from 'react';
import { AppRegistry, Linking, TouchableOpacity,StyleSheet, Text, TextInput, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import firebase from 'react-native-firebase'


export default class Home extends Component {
  state = {
    gameId: 'user123',
  }

  startGame = () => {
    this.props.navigation.navigate('GameController', { gameId: this.state.gameId })
  }

  onSuccess = (e) =>  {
    this.setState({gameId: e.data}, () => {
      firebase.database().ref(`/${this.state.gameId}/user`).set(true)
      this.startGame()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          topContent={
            <Text style={styles.centerText}>
              Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
            </Text>
          }
        />
        <TextInput
          style={styles.gameInput}
          placeholder="Insert game id"
          onChangeText={gameId => { this.setState({ gameId: gameId || 'user123' }) }}
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
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

AppRegistry.registerComponent('default', () => Home);