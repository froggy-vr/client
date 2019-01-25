/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import Home from './Containers/Home'


export default class App extends Component {
  
  state = {
    height: 0,
    width: 0
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
        <Home />
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
