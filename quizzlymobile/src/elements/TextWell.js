'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import s from '../modules/Style.js';

export default class TextWell extends Component {
  constructor(props) {
    super(props);
  }

  chooseColor() {
    switch (this.props.color) {
      case 'green':
        return {backgroundColor: s.lightGreen};
      case 'blue':
        return {backgroundColor: s.lightBlue};
      case 'red':
        return {backgroundColor: s.lightRed};
    }
  }

  render() {
    var pr = this.props;
    return (
      <View
        style={[styles.textWell, pr.style, this.chooseColor()]}
      >
        <Text style={s.pSmall}>{pr.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textWell: {
    alignSelf: 'stretch',
    borderRadius: 10,
    borderColor: s.lightGray,
    borderWidth: 1,
    padding: 10,
  },
});
