import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors'
import firebase from 'react-native-firebase'

const R = require('ramda')
const G = 9.80665

setUpdateIntervalForType(SensorTypes.accelerometer, 25);

export default class Home extends Component {

  state = {
    userId: 'user123',
    acceleration: { x: 0, y: 0, z: 0 },
    accelerationInclGravity: { x: 0, y: 0, z: 9.8 },
    g: { x: 0, y: 0, z: 1 },
    samples: [],
    jump: false,
  }

  _subscribeAccelerometer = () => {
    let lastJump = Date.now()

    accelerometer.subscribe(({ x, y, z, timestamp }) => {
      if (Math.sqrt(x ** 2 + y ** 2 + z ** 2) <= 10) {
        this.setState({
          g: {
            x: Math.sin(Math.atan(x / Math.sqrt(y ** 2 + z ** 2))),
            y: Math.sin(Math.atan(y / Math.sqrt(x ** 2 + z ** 2))),
            z: Math.sin(Math.atan(z / Math.sqrt(x ** 2 + y ** 2))),
          }
        })
      }

      let accelerationInclGravity = { x, y, z }
      let acceleration = {
        x: x - this.state.g.x * G,
        y: y - this.state.g.y * G,
        z: z - this.state.g.z * G,
      }

      let quadraticSum =
        Math.sign(this.state.g.x * acceleration.x) * (this.state.g.x * acceleration.x) ** 2
        + Math.sign(this.state.g.y * acceleration.y) * (this.state.g.y * acceleration.y) ** 2
        + Math.sign(this.state.g.z * acceleration.z) * (this.state.g.z * acceleration.z) ** 2

      this.setState(state => ({
        accelerationInclGravity,
        acceleration,
        samples: state.samples.slice(-9).concat(
          Math.sqrt(Math.abs(quadraticSum)) * Math.sign(quadraticSum)
        ),
      }))

      let jump = this.state.samples.length >= 10 && R.mean(this.state.samples) > 5
      if (jump !== this.state.jump) {
        console.log('jump', jump)
        this.setState({ jump })
        firebase.database().ref(`/${this.state.userId}/jump`).set(jump)
      }
    })
  }

  handlePress = () => {
    this.setState({ jump: true })
    firebase.database().ref(`/${this.state.userId}/jump`).set(true)
      .then(() => {
        this.setState({ jump: false })
        firebase.database().ref(`/${this.state.userId}/jump`).set(false)
      })
  }

  // componentWillMount() {
  //   this.setState({ userId: firebase.database().ref().push().key })
  // }

  componentDidMount() {
    this._subscribeAccelerometer()
  }

  // componentWillUnmount() {
  //   firebase.database().ref(`/${this.state.userId}`).remove()
  // }


  render() {
    return (
      <View style={styles.container} onPress={this.handlePress} >
        <Text style={styles.instruction}>Swing the phone up or tap the screen to jump</Text>
        {
          this.state.jump
          && <Text style={{ fontSize: 50 }}>Loncat</Text>
        }
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
    width: '100%',
    padding: 30
  },
  instruction: {
    color: 'white',
    fontSize: 20,
    textAlign: "center"
  }
});
