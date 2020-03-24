/**
 * Quizzly React Native App
 * Login
 * @keionanvari
 */

'use strict';
import React, { Component } from 'react';
import {
   StyleSheet,
   Text,
   View, Image, TextInput, TouchableHighlight, Alert
} from 'react-native';

module.exports = React.createClass({
   getInitialState: function() {
      return {
         email: '',
         password: ''
      };
   },
   render: function() {
      return (
         <Image source={require('./images/rect-bg.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
               <Text style={styles.quizzly}>QUIZZLY</Text>
               <Image
                  style={styles.logo}
                  source={require('./images/logo.png')}
                  />
               <View style={styles.loginContainer}>

                  <View style={styles.fields}>

                     <TextInput
                        style={styles.input}
                        value={this.state.email}
                        keyboardType={'email-address'}
                        onChangeText={(text) => this.setState({email: text})}
                        placeholder={'School Email'}
                        placeholderTextColor="#FFFFFF"
                        />

                     <View style={styles.separator} />
                     <View style={{padding: 10}} />

                     <TextInput
                        style={styles.input}
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({password: text})}
                        placeholder={'Password'}
                        placeholderTextColor="#FFFFFF"
                        />
                     <View style={styles.separator} />

                  </View>

                  <TouchableHighlight
                     style={styles.button}
                     onPress={this.onPress}>
                     <Text style={styles.buttonText}>SIGN IN</Text>
                  </TouchableHighlight>

                  <View style={{padding: 5}} />
                  <Text style={styles.signUp}>Or switch to sign up </Text>
               </View>

            </View>
            <TouchableHighlight
               style={styles.button}
               onPress={this.onPress}>
               <Text style={styles.about}>About</Text>
            </TouchableHighlight>
         </Image>
      );
   },
   onPress: function() {
      //console.log(this.state.username);
      Alert.alert('Alert', 'Hello' + ' ' + this.state.email + '!', [{text: 'OK'}] );
   }
});

var styles = StyleSheet.create({
   container: {
      flex: 1,
      //justifyContent: 'center',
      alignItems: 'stretch',
   },
   backgroundImage: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover', // or 'stretch'
   },
   input: {
      width: 350,
      //color: '#48BBEC',
      padding: 10,
      height: 60,
      // borderColor: '#48BBEC',
      // borderWidth: 1,
      //borderRadius: 4,
      fontFamily: 'GillSans-Light',
      fontSize: 28,
      textAlign: 'center',
      alignSelf: 'center',
      // borderBottomColor: '#48BBEC',
      // borderBottomWidth: 1,
      // borderTopWidth: 0,
      color: 'white'
      //backgroundColor: '#ffffff'
   },
   buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      alignSelf: 'center'
   },
   button: {
      height: 44,
      flexDirection: 'row',
      //backgroundColor: '#48BBEC',
      alignSelf: 'stretch',
      justifyContent: 'center'
   },
   quizzly: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      margin: 20,
      top: 15,
      padding: 25,

   },
   loginContainer: {

   },
   logo: {
      //flex: 1,
      padding: 10,
      width: 100,
      height: 100,
      alignSelf: 'center'
   },
   fields: {
      padding: 25
   },
   about: {
      fontFamily: 'GillSans-Light',
      fontSize: 12,
      color: 'white',
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
   },
   signUp: {
      color: 'white',
      alignSelf: 'center',
      fontFamily: 'GillSans-Light',
      fontSize: 14
   },
   separator: {
      height: 2,
      backgroundColor: '#ffffff'
   }
});
