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
import { setUpdateIntervalForType, SensorTypes, gyroscope, accelerometer } from 'react-native-sensors'

setUpdateIntervalForType(SensorTypes.gyroscope, 200);
setUpdateIntervalForType(SensorTypes.accelerometer, 200);


export default class App extends Component {
  
  state = {
    x: 0,
    y: 0,
    z: 0,
    xAccelero: 0,
    yAccelero: 0,
    zAccelero: 0,
    timestamp: "",
    counter: 0,
    arnold: 0,
  }
  
  componentDidMount(){
    // gyroscope.subscribe(({ x, y, z }) =>
    //   this.setState({ x, y ,z })
    // );
    accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let yAcc = Math.pow(y * Math.cos(Math.atan(z/y)), 2)
      let zAcc = Math.pow(z * Math.sin(Math.atan(z/y)), 2)
      if(Math.sqrt(yAcc + zAcc) >= 12){
        this.haloha(yAcc, zAcc)
      }
      this.setState(state => ({ xAccelero: x, yAccelero: y , zAccelero: z, initialDegree: Math.atan(z/y) })); 
    })
  }

  haloha = (yAcc, zAcc) => {
    this.setState({
      arnold: this.state.arnold + 1
    }, () => {
      console.log(this.state.arnold)
    })
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
        
        <Text style={{fontSize: 30}}>{this.state.initialDegree} ini initial degree</Text>
{/* 
        <Text style={{fontSize: 30}}>{this.state.x.toFixed(5)} ini X</Text>
        <Text style={{fontSize: 30}}>{this.state.y.toFixed(5)} ini Y</Text>
        <Text style={{fontSize: 30}}>{this.state.z.toFixed(5)} ini Z</Text> */}

        <Text style={{fontSize: 30, fontWeight: 'bold'}}>INI ACCELERO</Text>
        <Text style={{fontSize: 30}}>{this.state.xAccelero.toFixed(5)} ini X</Text>
        <Text style={{fontSize: 30}}>{this.state.yAccelero.toFixed(5)} ini Y</Text>
        <Text style={{fontSize: 30}}>{this.state.zAccelero.toFixed(5)} ini Z</Text>


      



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
