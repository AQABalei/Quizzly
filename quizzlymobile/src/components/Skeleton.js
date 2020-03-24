import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import s from '../modules/Style.js';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount(){

 }
 render(){
    var pr = this.props;
    var st = this.state;
    render(
      <View style={styles.container}>
         Hello
      </View>
   );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
