import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer, gyroscope } from 'react-native-sensors'
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase'
import KeepAwake from 'react-native-keep-awake'

const G = 9.80665

setUpdateIntervalForType(SensorTypes.accelerometer, 25);
setUpdateIntervalForType(SensorTypes.gyroscope, 25);

let gyroscopeSubscribtion
let accelerometerSubscribtion

export default class Home extends Component {

  state = {
    jump: false
  }

  _subscribeSensors = () => {

    let gyro = 0
    let lastUpwardAcceleration = 0
    let g = { x: 0, y: 0, z: 1 }

    gyroscopeSubscribtion = gyroscope.subscribe(({ x, y, z, timestamp }) => {
      gyro = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
    })

    accelerometerSubscribtion = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let totalAccelerationInclGravity = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
      if (totalAccelerationInclGravity >= G - 0.2 && totalAccelerationInclGravity <= G + 0.2) {
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

      let upwardAcceleration = Math.sqrt(Math.abs(quadraticSum)) * Math.sign(quadraticSum)

      if (
        upwardAcceleration > 7
        && upwardAcceleration - gyro > 7
        && upwardAcceleration - lastUpwardAcceleration > 5
        && !this.state.jump
      ) {
        this.setState({jump: true})
        firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/jump`).set(true)
      } else if (Math.abs(upwardAcceleration) < 0.2 && this.state.jump) {
        this.setState({jump: false})
        firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/jump`).set(false)
      }

      lastUpwardAcceleration = upwardAcceleration
    })
  }


  tapText = () => {
    this.setState({ jump: true })
    firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/jump`).set(true)
  }

  resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });

  handleCloseButton = () => {
    firebase.database().ref(`/${this.props.navigation.getParam('gameId')}/connected`).set(false)
      .then(() => {
        this.props.navigation.dispatch(this.resetStack)
      })
  }

  componentDidMount() {
    this._subscribeSensors()
  }

  componentWillUnmount() {
    accelerometerSubscribtion.unsubscribe()
    gyroscopeSubscribtion.unsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.textContainer} onPress={this.tapText} >
          <Text style={styles.instruction}>Swing the phone up or tap this text to jump</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleCloseButton}>
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </View>
        </TouchableOpacity>
        <KeepAwake />
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
