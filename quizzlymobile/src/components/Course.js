import React, { Component } from 'react';
import {
   Text,
   View,
   Navigator,
   StyleSheet,
   TouchableHighlight, PushNotificationIOS, Alert
} from 'react-native';

import s from '../modules/Style.js';
import NavBar from './NavBar.js'

export default class Course extends Component {
   constructor(props) {
      super(props);
      this.state = {

      };
   }

   back() {
      this.props.navigator.pop();
   }

   takeQuiz(){
      console.log("Take quiz...");
      var question = {
         text: 'What is threading ?'

      };

      this.props.navigator.push({
         name: 'Questions',
         passProps: {course: this.props.course, title:this.props.course.title, state:this.state, question}
      });
      //Need to get access quiz socket ??
   }


   viewScores(){
      console.log("View Scores...");
      this.props.navigator.push({
         name: 'QuizzList',
         passProps: {course: this.props.course, title:this.props.course.title, state:this.state}
      });
      //Need to get access to scores ??
   }
   renderNavBar(){
      var pr = this.props;
      return (
         <View>
         <NavBar
         title={pr.title}
         back={this.back.bind(this)}
         currentPage={this}
         hasBack
         />
         </View>
      );
   }

   renderBody(){
      return(
         <View>

         {/* <TouchableHighlight
            style={styles.button}
            onPress={this.takeQuiz.bind(this)}
         >
            <Text style={styles.buttonText}>Take Quiz</Text>
         </TouchableHighlight> */}

         <TouchableHighlight
            style={styles.scoresButton}
            onPress={this.viewScores.bind(this)}
         >
            <Text style={styles.buttonText}>View Scores</Text>
         </TouchableHighlight>

         </View>
      );
   }

   render(){
      var pr = this.props;
      var st = this.state;
      return (
         <View style={styles.container}>
         {this.renderNavBar()}
         {this.renderBody()}
         <Text style={styles.connectedLabel}>Connected</Text>

         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   button: {
      borderRadius:7,
      borderWidth: .25,
      width: 320,
      height: 40,
      justifyContent:'center',
      alignSelf:'center',
      margin: 20,
      backgroundColor: '#E1FBFF'
   },
   scoresButton: {
      borderRadius:7,
      borderWidth: .25,
      width: 320,
      height: 40,
      justifyContent:'center',
      alignSelf:'center',
      backgroundColor: '#D9FFF0'
   },
   buttonText:{
      textAlign: 'center',
      fontStyle: 'italic',
      color: s.black
   },
   connectedLabel:{
      marginTop:450,
      color:'green',
      alignSelf:'center'
   }
});
