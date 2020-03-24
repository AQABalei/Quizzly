/**
 * Quizzly React Native App
 * Main
 * @keionanvari
 */

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import s from '../modules/Style';
import Row from '../elements/Row';

export default class QuestionRow extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //console.log(">>>>>>>>>>>> question", this.props.question);
  }

  renderCourseRowBody() {
    var pr = this.props;
    return (
      <View style={styles.infoContainer}>
        <Text style={[s.p, s.italic]} numberOfLines={5}>
          {pr.question.text}
        </Text>
        <View style={styles.endInfoContainer}>
          <Text style={styles.arrow}>
            >
          </Text>
        </View>
      </View>
    );
  }

  render() {
    var pr = this.props;
    return (
      <TouchableHighlight
        onPress={pr.goTo.bind(this, pr.question)}
      >
        <Row
          body={this.renderCourseRowBody()}
        />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  endInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'stretch',
  },
  grade: {
    color: s.green,
    marginRight: 10
  },
  arrow: {
    color: s.gray
  }
});
