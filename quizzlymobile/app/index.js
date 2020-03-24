/**
 * Quizzly React Native App
 * Main
 * @keionanvari
 */

'use strict';
import React from 'react';
import {
  AlertIOS,
  Navigator,
  StyleSheet,
  AppRegistry,
  PushNotificationIOS,
  Platform
} from 'react-native';

import Entrance from '../src/components/Entrance';
import Courses from '../src/components/Courses';
import Course from '../src/components/Course';
import Answers from '../src/components/Answers';
import AnswerQuiz from '../src/components/AnswerQuiz';
import Questions from '../src/components/Questions';
import QuestionsList from '../src/components/QuestionsList';
import QuizzList from '../src/components/QuizzList';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceID: null,
      navigator: null,
      permissions: null,
      installation: null
   };
  }
   componentDidMount(){
    if(Platform.OS == 'ios') {
     PushNotificationIOS.addEventListener('register', this._onRegistered.bind(this));
     PushNotificationIOS.requestPermissions();
    } else {
    }
   }
   componentWillUnmount() {
    if(Platform.OS == 'ios') {
     PushNotificationIOS.removeEventListener('register', this._onRegistered.bind(this));
    }
   }

  _showPermissions() {
     console.log("Checking Perms...");
     if(Platform.OS == 'ios') {
       PushNotificationIOS.checkPermissions((permissions) => {
         this.setState({permissions});
         console.log('Perms: ', JSON.stringify(this.state.permissions));
       });
     } else {
     }
   }

  testPush(){
    console.log("test push");
    this._sendNotification();
  }

  _sendNotification() {
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
    console.log("OnRegistered_DeviceToken:", deviceToken);
    this.state.deviceID = deviceToken;

   // Handle creation of new installation{deviceToken, ios, userID}
   var DeviceInfo = require('react-native-device-info');
   var installation = {
      deviceId: deviceToken,
      type: DeviceInfo.getManufacturer() == 'Apple' ? 'ios' : 'android'
   };

   this.setState({installation: installation});

   console.log('!!Instalation Obj to be saved at signup :', installation);

  }
  _onRegistrationError(error) {
    AlertIOS.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  renderScene(route, navigator) {
     var props = {};
     props.testPush = this.testPush.bind(this);
     props.deviceID = this.state.deviceID;
     props.installation = this.state.installation;

    switch (route.name) {
      case 'Entrance':
        return <Entrance {...props} navigator={navigator} {...route.passProps}  />
      case 'Courses':
        return <Courses {...props} navigator={navigator} {...route.passProps}  />
      case 'Course':
         return <Course {...props} navigator={navigator} {...route.passProps}  />
      case 'Answers':
        return <Answers navigator={navigator} {...route.passProps}  />
      case 'Questions':
        return <Questions navigator={navigator} {...route.passProps}  />
     case 'AnswerQuiz':
         return <AnswerQuiz navigator={navigator} {...route.passProps}  />
      case 'QuizzList':
        return <QuizzList navigator={navigator} {...route.passProps}  />
      case 'QuestionsList':
        return <QuestionsList navigator={navigator} {...route.passProps}  />
    }
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{ name: 'Entrance' }}
        renderScene={ this.renderScene.bind(this) }
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
