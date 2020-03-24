
import React, { Component } from 'react';
import {
   Alert,
   Text,
   View,
   StyleSheet,
   PushNotificationIOS, AppState
} from 'react-native';

import s from '../modules/Style.js';
import LinearGradient from 'react-native-linear-gradient';
import NavigationBar from 'react-native-navbar';

import Session from '../modules/Session'
import Api from '../modules/Api'



export default class NavBar extends Component {
   constructor(props) {
      super(props);
      this.state = {

      };
   }

   testPush() { this._sendLocalNotification(); }

   refresh() {
      if(this.props.title == "Courses") {
         console.log("refreshing courses");
         //this.props.back;
         this.props.currentPage.componentDidMount();

      }
      else if(this.props.title == this.props.courseTitle) {
         console.log("refreshing quizzes");
         this.props.currentPage.componentDidMount();
      }
      else if(this.props.title == this.props.quizTitle) {
         console.log("refreshing questions");
         this.props.currentPage.componentDidMount();
      }
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

   render(){
      var pr = this.props;
      var st = this.state;
      var rightButtonConfig = {
         title: 'Refresh',
         tintColor: 'white',
         handler: this.refresh.bind(this),
      };
      var leftButtonConfig = {
         title: 'Back',
         tintColor: 'white',
         handler: pr.back,
      };
      var logoutButtonConfig= {
         title: 'Log Out',
         tintColor: 'white',
         handler: pr.back,
      };

      var titleConfig = {
         title: pr.title,
         tintColor: 'white'
      };
      var statusBarConfig = {
         style: 'light-content',
         hidden: false,
         tintColor: '#2F3E4E',
         showAnimation: 'slide',
         hideAnimation: 'slide'
      };
      return(
         <View style={styles.container}>
         <NavigationBar
         style={styles.navBar}
         title={titleConfig}
         statusBar={statusBarConfig}
         rightButton={rightButtonConfig} 
         leftButton={this.props.hasBack ? (titleConfig.title == "Courses") ? logoutButtonConfig : leftButtonConfig : {}}
         />
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   navBar: {
      borderTopWidth: 0,
      borderBottomColor: 'rgba(0, 0, 0, 0.1)',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      // iOS styles:
      backgroundColor: '#2F3E4E',
      height: 60,
      paddingLeft: 8,
      paddingRight: 8,
   }
});
