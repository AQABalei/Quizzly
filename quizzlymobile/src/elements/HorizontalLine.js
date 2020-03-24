'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import s from '../modules/Style.js';

export default class HorizontalLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <View style={pr.style}>
        <View style={styles.horizontalLine}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontalLine: {
    height: 1,
    backgroundColor: s.white,
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20
  },
});
