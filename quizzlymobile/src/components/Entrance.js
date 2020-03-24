import React, { Component } from 'react';
import {
   Text,
   View,
   TouchableOpacity,
   StyleSheet,
   TextInput,
   Image,
   AsyncStorage, 
   PushNotificationIOS, 
   Platform,
   Alert
} from 'react-native';

import s from '../modules/Style.js';
import Objects from '../modules/Objects.js';
import Api from '../modules/Api.js';
import Session from '../modules/Session.js';
import HorizontalLine from '../elements/HorizontalLine';
import LinearGradient from 'react-native-linear-gradient';

export default class Entrance extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: '',
         password: '',
         firstName: '',
         lastName: '',
         isSignUp: false,
         //deviceToken: '',
         deviceToken: props.deviceID
      };
   }

   componentDidMount(){
      Api.server.find("student")
      .then((students) => {
         this.setState({student: students[0]})
      })
      if(Platform.OS == 'ios') {
         PushNotificationIOS.addEventListener('localNotification', this._onLocalNotificationIOS.bind(this));
         PushNotificationIOS.addEventListener('notification', this._onRemoteNotificationIOS.bind(this));
         // PushNotificationIOS.addEventListener('register', (token) => {
         //     this.setState({deviceToken: token});
         //     console.log('setting device token to: ', token);
         //  });
      } else {
      }
   }
   componentWillUnmount() {
     if(Platform.OS == 'ios') {
       PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotificationIOS.bind(this));
       PushNotificationIOS.removeEventListener('notification', this._onRemoteNotificationIOS.bind(this));
      } else {

      }
    }

   takeQuestionLocal() {
      var pr = this.props;
      var st = this.state;
      var question = {
         "answers": [
            {
               "option": "A",
               "text": "String stuff",
               "correct": false,
               "question": "57c4d01d21cb2133112c0870",
               "createdAt": "2016-08-30T00:15:25.449Z",
               "updatedAt": "2016-08-30T00:15:25.449Z",
               "id": "57c4d01d21cb2133112c0871"
            },
            {
               "option": "B",
               "text": "Needle through the eye",
               "correct": true,
               "question": "57c4d01d21cb2133112c0870",
               "createdAt": "2016-08-30T00:15:25.450Z",
               "updatedAt": "2016-08-30T00:15:25.450Z",
               "id": "57c4d01d21cb2133112c0872"
            },
            {
               "option": "C",
               "text": "Masterfully sad",
               "correct": false,
               "question": "57c4d01d21cb2133112c0870",
               "createdAt": "2016-08-30T00:15:25.450Z",
               "updatedAt": "2016-08-30T00:15:25.450Z",
               "id": "57c4d01d21cb2133112c0873"
            },
            {
               "option": "D",
               "text": "Masterfully sad",
               "correct": false,
               "question": "57c4d01d21cb2133112c0870",
               "createdAt": "2016-08-30T00:15:25.450Z",
               "updatedAt": "2016-08-30T00:15:25.450Z",
               "id": "57c4d01d21cb2133112c0873"
            }
         ],
         "quiz": {
            "title": "Threading",
            "course": "57c4cf2821cb2133112c0867",
            "createdAt": "2016-08-30T00:13:23.793Z",
            "updatedAt": "2016-08-30T00:15:01.907Z",
            "id": "57c4cfa321cb2133112c086b"
         },
         "text": "What is threading?",
         "type": "multipleChoice",
         "duration": 30,
         "createdAt": "2016-08-30T00:15:25.443Z",
         "updatedAt": "2016-08-30T00:15:25.445Z",
         "id": "57c4d01d21cb2133112c0870"
      };

      pr.navigator.push({
         name: 'AnswerQuestion',
         passProps: {state:this.state, question:question, questionKey:100000, time:30}
      });
   }

   takeQuizLocal() {
      var pr = this.props;
      var st = this.state;
      var data = {
        "quiz": {
          "id": "580de6254c7ce41b004eacf8",
          "title": "Introduction",
          "questions": [
            {
              "answers": [
                {
                  "option": "A",
                  "text": "Crowley",
                  "correct": false,
                  "question": "580de6504c7ce41b004eacf9",
                  "createdAt": "2016-10-24T10:45:36.084Z",
                  "updatedAt": "2016-10-24T10:45:36.084Z",
                  "id": "580de6504c7ce41b004eacfa"
                },
                {
                  "option": "B",
                  "text": "Miller",
                  "correct": true,
                  "question": "580de6504c7ce41b004eacf9",
                  "createdAt": "2016-10-24T10:45:36.085Z",
                  "updatedAt": "2016-10-24T10:45:36.085Z",
                  "id": "580de6504c7ce41b004eacfb"
                },
                {
                  "option": "C",
                  "text": "Shindler",
                  "correct": false,
                  "question": "580de6504c7ce41b004eacf9",
                  "createdAt": "2016-10-24T10:45:36.087Z",
                  "updatedAt": "2016-10-24T10:45:36.087Z",
                  "id": "580de6504c7ce41b004eacfc"
                }
              ],
              "quiz": "580de6254c7ce41b004eacf8",
              "text": "What is the professor's name?",
              "type": "multipleChoice",
              "duration": 17,
              "createdAt": "2016-10-24T10:45:36.042Z",
              "updatedAt": "2016-11-02T18:35:00.878Z",
              "lastAsked": "2016-11-02T18:35:00.000Z",
              "id": "580de6504c7ce41b004eacf9"
            },
            {
              "answers": [],
              "quiz": "580de6254c7ce41b004eacf8",
              "text": "What are you excited to learn about?",
              "type": "freeResponse",
              "duration": 30,
              "createdAt": "2016-10-24T10:46:34.164Z",
              "updatedAt": "2016-11-02T18:35:05.955Z",
              "lastAsked": "2016-11-02T18:35:05.000Z",
              "id": "580de68a4c7ce41b004eacfd"
            }
          ],
          "section": {
            "course": {
              "title": "CSCI 401",
              "professor": "57fb076771beb51100367c87",
              "term": "57fb067f7b277c110013b7a8",
              "createdAt": "2016-10-24T10:44:25.209Z",
              "updatedAt": "2016-10-24T10:44:25.209Z",
              "id": "580de6094c7ce41b004eacf7"
            },
            "title": "38323",
            "createdAt": "2016-10-24T10:49:51.383Z",
            "updatedAt": "2016-10-26T17:57:34.579Z",
            "id": "580de74f4c7ce41b004ead02"
          },
          "timeAsked": 1478113782792
        }
      };

   pr.navigator.push({
      name: 'AnswerQuiz',
      passProps: {state:this.state, quiz:data.quiz, questionKey:100000, time:30}
   });
}


_onLocalNotificationIOS(notification){
   var pr = this.props;
   var st = this.state;
   Alert.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [
         { text: 'Take Quiz',  onPress:this.takeQuizLocal.bind(this) },
         { text: 'Cancel',     }
      ]
   );
}

_onRemoteNotificationIOS(notification) {
   var pr = this.props;
   var st = this.state;

   console.log("Question key::::: ", notification._data.questionKey);

   Alert.alert(
      'Quiz Alert',
      'Please take 30 seconds to finish the quiz - ' + notification.getMessage(),
      [
         { text: 'Take Quiz',  onPress: function takeQuizRemote() {
            console.log("Notification KEY  ::: ", notification);

            if (typeof notification._data.questionKey != 'undefined') {
               console.log("Question KEY  ::: ", notification._data.questionKey);
               Api.server.post('question/getopenquestion', {questionKey: notification._data.questionKey})
               .then((data) => {
                  console.log("Take Remote question -!!!! ::: ", data);
                  data.question.timeRemaining = notification._data.timeRemaining
                  pr.navigator.push({
                     name: 'Questions',
                     passProps: {question:data.question}
                  });
               });
            } else if(typeof notification._data.quizKey != 'undefined') {
               console.log("Quiz KEY  ::: ", notification._data.quizKey);
               Api.server.post('quiz/getopenquiz', {quizKey: notification._data.quizKey})
               .then((data) => {
                  console.log("Take Remote QUIZ -!!!! ::: ", data);
                  pr.navigator.push({
                     name: 'AnswerQuiz',
                     passProps: {state:this.state, quiz:data.quiz, quizKey:notification._data.quizKey, time:data.timeRemaining}
                  });
               });
            } else {
               console.log("No Question or Quiz Key was passed with Notification;::: ", notification);
            }
         }},
         { text: 'Cancel',     }
      ]
   );
}

enterQuizzly() {
   // TODO: must add this back in
   if(this.state.isSignUp) {
      this.signUp();
   } else {
      this.signIn();
   }
}

setSession(student) {
   Session.student = student;
}

signUp() {
   console.log("in signup function")
   var st = this.state;
   var pr = this.props;

   var DeviceInfo = require('react-native-device-info');

   var mobile = {
      deviceId: '69',
      type: DeviceInfo.getManufacturer() == 'Apple' ? 'ios' : 'android'
   };

   var user = {
      email: st.email,
      password: st.password,
      firstName: st.firstName,
      lastName: st.lastName,
      mobile: pr.installation,
      deviceToken: st.deviceToken
   };
   console.log('User  :::: ', user);

   Api.server.post('signup', user)
   .then((signupResponse) => {
      console.log("attempting to signup");
      if(!signupResponse || !signupResponse.jwt || !signupResponse.user){
         console.log("The sign up isn't successful");
      }else{
         console.log("signupResponse.token", signupResponse.jwt);
         AsyncStorage.setItem('token',JSON.stringify(signupResponse));
         this.setSession(signupResponse.user);
         console.log("after set up signupResponse.token", signupResponse.jwt);
         this.goToCourses(this.state);
      }
   });

}

signIn() {
   var st = this.state;
   var pr = this.props;

   var DeviceInfo = require('react-native-device-info');
   console.log('Model :::: ', DeviceInfo.getManufacturer());
   var mobile = {
      deviceId: '69',
      type: DeviceInfo.getManufacturer() == 'Apple' ? 'ios' : 'android'
   };

   var user = {
      email: st.email,
      password: st.password,
      mobile: pr.installation,
      deviceToken: st.deviceToken
   };
   // console.log("here at before the API Login ");
   // console.log("st.email", st.email);
   // console.log("st.password",st.password);

   Api.server.post('login', user)
   .then((loginResponse)=>{
      console.log("loginResponse.token", loginResponse.jwt);
      console.log("loginResponseInfo", JSON.stringify(loginResponse));
      console.log("loginResponse.type", loginResponse.type);
      AsyncStorage.setItem('token',JSON.stringify(loginResponse));
      this.setSession(loginResponse.user);
      //Prep for storing the user object to the AsyncStorage
      // AsyncStorage.setItem('user',JSON.stringify(user));
      console.log("after set up loginResponse.token", loginResponse.jwt);
      if(loginResponse.jwt == undefined){
         //update the front end GUI to show that user doesn't exist
         console.log("The user info isn't correct");
         Alert.alert (
            "Invalid Login Info",
            "Please Try Again"
         );
      }
      else if(loginResponse.user.type != "STUDENT") {
         console.log("Professor trying to log in on mobile");
         Alert.alert (
            "Invalid Login Info",
            "Professors Can't Log in on Mobile"
         );
      }
      else{
         console.log("Right before the goToCourses");
         this.goToCourses(this.state);
         // this.goToCourses(user);  //just for test
      }
   })

   //if authentificated, go to the courselist page

   // return this.fetchPost(this.baseUrl + model + findUrl, data);
}

goToCourses(props) {

   console.log("<<<<<<<< device ID: ", this.props.deviceID);
   this.props.navigator.push({
      name: 'Courses',
      passProps: props
   });
}

toggleSignInUp() {
   this.setState({isSignUp: !this.state.isSignUp});
}

startTimer(duration, display) {
   var timer = duration, minutes, seconds;
   setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
         timer = duration;
      }
   }, 1000);
}

renderMainInputs() {
   var st = this.state;
   var pr = this.props;
   return (
      <View>
      <TextInput
      style={s.inputClear}
      value={st.email}
      keyboardType={'email-address'}
      onChangeText={(text) => this.setState({email: text})}
      placeholder={'School Email'}
      placeholderTextColor={s.white}
      />
      <TextInput
      style={s.inputClear}
      value={st.password}
      secureTextEntry={true}
      onChangeText={(text) => this.setState({password: text})}
      placeholder={'Password'}
      placeholderTextColor={s.white}
      />
      </View>
   );
}

renderSignUpInputs() {
   var st = this.state;
   return (
      <View>
      <TextInput
      style={s.inputClear}
      value={st.firstName}
      onChangeText={(text) => this.setState({firstName: text})}
      placeholder={'First name'}
      placeholderTextColor={s.white}
      />
      <TextInput
      style={s.inputClear}
      value={st.lastName}
      onChangeText={(text) => this.setState({lastName: text})}
      placeholder={'Last name'}
      placeholderTextColor={s.white}
      />
      </View>
   );
}

render() {
   var st = this.state;
   var pr = this.props;
   return (
      <LinearGradient
      colors={['#32F1A8', '#32D7EF']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      >
      <Text style={[styles.logoFont, {marginBottom: 10}]}>QUIZZLY</Text>

      <Image
      style={styles.logoImage}
      source={require('./images/logo.png')}
      />

      {this.renderMainInputs()}
      {st.isSignUp ? this.renderSignUpInputs() : null}

      <TouchableOpacity
      onPress={this.enterQuizzly.bind(this)}
      >
      <Text style={styles.boldButtonText}>{st.isSignUp ? "SIGN UP" : "SIGN IN"}</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
      <Text style={[s.p, {color: s.white}]}>Or switch to </Text>
      <TouchableOpacity
      onPress={this.toggleSignInUp.bind(this)}
      >
      <Text style={[s.p, s.underline, {color: s.white}]}>{st.isSignUp ? "sign in" : "sign up"}</Text>
      </TouchableOpacity>

      {/* <CountDown
         onPress={this.sendAgain} //default null
         text={'Try again'} //default ''
         time={60} //default 60
         buttonStyle={{padding:20}}
         textStyle={{color:'black'}} //default black
         disabledTextStyle={{color:'gray'}} //default gray
         /> */}

         </View>

         <Text style={[s.p, s.underline, styles.bottomInfoContainer, {color: s.white}]}>About</Text>
         </LinearGradient>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 40
   },
   logoImage: {
      alignSelf: 'center',
      marginTop: 25,
      marginBottom: 25,
      width: 78,
      height: 80,
   },
   logoFont: {
      fontSize: 30,
      fontWeight: '700',
      color: s.white,
      alignSelf: 'center',
      fontFamily: s.mont
   },
   lineSpace: {
      marginTop: 5,
      marginBottom: 20,
   },
   boldButtonText: {
      fontSize: 22,
      fontWeight: '700',
      color: s.white,
      alignSelf: 'center',
      fontFamily: s.mont
   },
   infoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 20
   },
   bottomInfoContainer: {
      alignSelf: 'center',
      marginBottom: 20
   }
});
