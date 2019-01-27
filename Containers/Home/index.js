import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';

export default class Home extends Component {
  state = {
    gameId: 'user123',
  }

  startGame = () => {
    this.props.navigation.navigate('GameController', { gameId: this.state.gameId })
  }

  render() {
    return (
      <View style={styles.container}>
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
});
