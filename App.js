/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */


import { createAppContainer, createStackNavigator } from "react-navigation"

import Home from './Containers/Home'
import GameController from './Containers/GameController'

const navigator = createStackNavigator({
  Home: {
    screen: Home,
  },
  GameController: {
    screen: GameController
  },
}, {
  headerMode: 'none',
})

export default createAppContainer(navigator)
