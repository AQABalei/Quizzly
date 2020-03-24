'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  Image
} from 'react-native';

import s from '../modules/Style.js';

export default class Row extends Component {
  constructor(props) {
    super(props);
  }


  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    var pr = this.props;
    return (
      <View
        style={[pr.style, styles.row]}
        ref={component => this._root = component}
      >
      <Image
        style={styles.icon}
        source={require('../assets/textbook.png')}
        />
        {pr.body}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 13,
    marginRight: 15,
    marginLeft: 15,
    borderColor: s.lightGray,
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  icon: {
    marginRight: 30,
    marginTop: 4,
    width: 18,
    height: 18
  }
});

AppRegistry.registerComponent('DisplayAnImage', ()=> DisplayAnImage)