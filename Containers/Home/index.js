import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { setUpdateIntervalForType, SensorTypes, accelerometer } from 'react-native-sensors'

setUpdateIntervalForType(SensorTypes.gyroscope, 200);
setUpdateIntervalForType(SensorTypes.accelerometer, 200);

export default class Home extends Component {
  
  state = { 
    x: 0,
    y: 0,
    z: 0,
    initialDegree: 0
  }

  componentDidMount(){
    accelerometer.subscribe(({ x, y, z, timestamp }) => {
      let yAcc = Math.pow(y * Math.cos(Math.atan(z/y)), 2)
      let zAcc = Math.pow(z * Math.sin(Math.atan(z/y)), 2)

      if(Math.sqrt(yAcc + zAcc) >= 12){
        // SEND TO FIREBASE
        console.log("Loncat nih")
      }
      this.setState({ x, y , z, initialDegree: Math.atan(z/y) }); 
    })
  }

 
  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30}}>{this.state.initialDegree} ini initial degree</Text>

        <Text style={{fontSize: 30, fontWeight: 'bold'}}>INI ACCELERO</Text>
        <Text style={{fontSize: 30}}>{this.state.x.toFixed(5)} ini X</Text>
        <Text style={{fontSize: 30}}>{this.state.y.toFixed(5)} ini Y</Text>
        <Text style={{fontSize: 30}}>{this.state.z.toFixed(5)} ini Z</Text>
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
