import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors'
import firebase from 'react-native-firebase'

const R = require('ramda')

setUpdateIntervalForType(SensorTypes.accelerometer, 25);

export default class Home extends Component {

  state = {
    userId: 'user123',
    g: { x: 0, y: 0, z: 1 },
    samples: [],
    jump: false,
  }

  _subscribeAccelerometer = () => {
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

      this.setState(state => ({
        samples: state.samples.slice(-19).concat(
          Math.sqrt((state.g.x * x) ** 2 + (state.g.y * y) ** 2 + (state.g.z * z) ** 2)
        )
      }))

      let jump = this.state.samples.length >=20 && R.mean(this.state.samples) > 11
      if (jump !== this.state.jump) {
        console.log('jump', jump)
        this.setState({ jump })
        firebase.database().ref(`/${this.state.userId}/jump`).set(jump)
      }
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
      <View style={styles.container}>
        <Text style={{ fontSize: 30 }}>{this.state.g.x.toFixed(5)} ini GX</Text>
        <Text style={{ fontSize: 30 }}>{this.state.g.y.toFixed(5)} ini GY</Text>
        <Text style={{ fontSize: 30 }}>{this.state.g.z.toFixed(5)} ini GZ</Text>
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
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
