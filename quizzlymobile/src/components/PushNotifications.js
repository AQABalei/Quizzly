import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  PushNotificationIOS
} from 'react-native';

import s from '../modules/Style.js';

export default class PushNotfications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: null
    };
  }

  componentDidMount(){
    PushNotificationIOS.addEventListener('register', this._onRegistered);
    // PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
    PushNotificationIOS.requestPermissions();

  }
  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this._onRegistered);
    //PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }
  _showPermissions() {
     console.log("Checking Perms...");

     PushNotificationIOS.checkPermissions((permissions) => {
       this.setState({permissions});
       console.log('Perms: ', JSON.stringify(this.state.permissions));
     });
   }
  testPush(){
    console.log("test push");
    this._sendNotification();
    PushNotificationIOS.addEventListener('register', function(token){
      console.log("hey");
      console.log('You are registered and the device token is: ',token)
    });

    PushNotificationIOS.addEventListener('notification', function(notification){
      console.log('You have received a new notification!', notification);
    });
  }
  _sendNotification() {
    //this._showPermissions();
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }
  _sendLocalNotification() {
    require('RCTDeviceEventEmitter').emit('localNotificationReceived', {
      aps: {
        alert: 'Sample local notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }
  _onRegistered(deviceToken) {
    Alert.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onRegistrationError(error) {
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onRemoteNotification(notification) {
    console.log("notification", notification);
    Alert.alert(
      'Quiz Alert',
      'Please take 30 seconds to finish the quiz - ' + notification.getMessage(),
      [{
        text: 'Take Quiz',
        onPress: null,
      }]
    );
  }

  _onLocalNotification(notification){
    Alert.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }
  _showPermissions() {
    console.log("working...");
    PushNotificationIOS.checkPermissions((permissions) => {
      this.setState({permissions});
    });
  }
  render(){
    var pr = this.props;
    var st = this.state;
    render(
      // <View style={styles.container}>
      // Hello
      // </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
