import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors'
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase'

const R = require('ramda')
const G = 9.80665

setUpdateIntervalForType(SensorTypes.accelerometer, 25);
let accelerometerSubscribtion

export default class Home extends Component {

  state = {
    jump: false,
  }

  _subscribeAccelerometer = () => {

    let g = { x: 0, y: 0, z: 1 }
    // let samples = []

    accelerometerSubscribtion = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      if (Math.sqrt(x ** 2 + y ** 2 + z ** 2) <= 10) {
        g = {
          x: Math.sin(Math.atan(x / Math.sqrt(y ** 2 + z ** 2))),
          y: Math.sin(Math.atan(y / Math.sqrt(x ** 2 + z ** 2))),
          z: Math.sin(Math.atan(z / Math.sqrt(x ** 2 + y ** 2))),
        }
      }

      let acceleration = {
        x: x - g.x * G,
        y: y - g.y * G,
        z: z - g.z * G,
      }

      let quadraticSum =
        Math.sign(g.x * acceleration.x) * (g.x * acceleration.x) ** 2
        + Math.sign(g.y * acceleration.y) * (g.y * acceleration.y) ** 2
        + Math.sign(g.z * acceleration.z) * (g.z * acceleration.z) ** 2

      // samples = samples.slice(-19).concat(
      //   Math.sqrt(Math.abs(quadraticSum)) * Math.sign(quadraticSum)
      // )
      // let jump = samples.length >= 10 && R.mean(samples) > 5

      let jump = Math.sqrt(Math.abs(quadraticSum)) * Math.sign(quadraticSum) > 30
      if (jump && !this.state.jump) console.log(Math.sqrt(Math.abs(quadraticSum)) * Math.sign(quadraticSum))
      if (jump !== this.state.jump) {
        console.log('jump', jump)
        this.setState({ jump })
        firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/jump`).set(jump)
      }
    })
  }


  tapText = () => {
    console.log('screen tap,', 'jump', true)
    this.setState({ jump: true })
    firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/jump`).set(true)
  }

  resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });

  componentDidMount() {
    this._subscribeAccelerometer()
  }

  componentWillUnmount() {
    accelerometerSubscribtion.unsubscribe()
    firebase.database().ref(`/${this.props.navigation.getParam('gameId')}`).remove()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.textContainer} onPress={this.tapText} >
          <Text style={styles.instruction}>Swing the phone up or tap this text to jump</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.props.navigation.dispatch(this.resetStack) }}>
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </View>
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
  textContainer: {
    padding: 30,
  },
  instruction: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 50,
    backgroundColor: '#1D3461',
    borderRadius: 30
  },
  closeButtonText: {
    color: 'white'
  },
});
