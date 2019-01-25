/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import {gyroscope, accelerometer} from 'react-native-sensors'
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//   'Double tap R on your keyboard to reload,\n' +
//   'Shake or press menu button for dev menu',
// });

setUpdateIntervalForType(SensorTypes.gyroscope, 300);
setUpdateIntervalForType(SensorTypes.accelerometer, 300);

export default class App extends Component {
  
  state = {
    x: 0,
    y: 0,
    z: 0,
    xAccelero: 0,
    yAccelero: 0,
    zAccelero: 0,
    timestamp: ""
  }
  
  componentDidMount(){
    gyroscope.subscribe(({ x, y, z, timestamp }) =>
    this.setState({ x: x.toFixed(5), y: y.toFixed(5) , z: z.toFixed(5), timestamp })
    );
    accelerometer.subscribe(({ x, y, z, timestamp }) =>
    this.setState({ xAccelero: x.toFixed(5), yAccelero: y.toFixed(5) , zAccelero: z.toFixed(5) })
    );
  }
  
  
  
  render() {

    let {height, width} = Dimensions.get('window')
    
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30}}>{this.state.height} ini Height</Text>
        <Text style={{fontSize: 30}}>{this.state.width} ini Width</Text>

        <Button 
          title="huehue"
          onPress={() => this.setState({height, width})}
        /> 

        <Text style={{fontSize: 30}}>{this.state.x} ini X</Text>
        <Text style={{fontSize: 30}}>{this.state.y} ini Y</Text>
        <Text style={{fontSize: 30}}>{this.state.z} ini Z</Text>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>INI ACCELERO</Text>
        {/* <Text>{this.state.timestamp} ini timestamp</Text> */}
        <Text style={{fontSize: 30}}>{this.state.xAccelero} ini X</Text>
        <Text style={{fontSize: 30}}>{this.state.yAccelero} ini Y</Text>
        <Text style={{fontSize: 30}}>{this.state.zAccelero} ini Z</Text>
        {/* <Text>{this.state.timestamp} ini timestamp</Text> */}
          {this.state.yAccelero >= 12 || this.state.zAccelero >= 12 ? 
            <Text style={{fontSize: 50}}>LONCAT NIH</Text>: null
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
