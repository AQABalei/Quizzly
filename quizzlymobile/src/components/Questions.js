import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';

import s from '../modules/Style.js';
import TextWell from '../elements/TextWell'
import Row from '../elements/Row'
import CourseRow from './CourseRow'
import Api from '../modules/Api'
import NavBar from './NavBar.js'

export default class Questions extends Component {
  constructor(props) {
    super(props);
    console.log("!!!PROPS: ", this.props.question);
    var length = this.props.question.answers.length;
    var type = this.props.question.type;

    var startTime = new Date();
    var lastAskedTime = new Date(this.props.question.lastAsked);
    var timeDiff = startTime.getTime() - lastAskedTime.getTime();
    var secondsDiff = timeDiff / 1000;
    var keyIndex = 4;
    console.log("seconds between:", secondsDiff);

    if(type=="multipleChoice"){
      if(length==3){
        this.state = {
            questions: [
              {title: this.props.question.text, //need to inser the dynamic loading options here
              A:this.props.question.answers[0].text,
              B:this.props.question.answers[1].text,
              C:this.props.question.answers[2].text,
              Type:type,
              index:'0'},
            ],
            pressedA: false,
            pressedB: false,
            pressedC: false,
            pressedSubmit: false,
            duration: this.props.question.duration,
            lastAsked: this.props.question.lastAsked,
            secondsSinceAsked: secondsDiff,
            canAnswer: this.props.question.duration > secondsDiff
          };
     }else if(length==4){
       this.state = {
           questions: [
             {title: this.props.question.text, //need to inser the dynamic loading options here

             A:this.props.question.answers[0].text,
             B:this.props.question.answers[1].text,
             C:this.props.question.answers[2].text,
             D:this.props.question.answers[3].text,
             Type:type,
             index:'0'},
           ],
           pressedA: false,
           pressedB: false,
           pressedC: false,
           pressedD: false,
           pressedSubmit: false,
           duration: this.props.question.duration,
           lastAsked: this.props.question.lastAsked,
           secondsSinceAsked: secondsDiff,
           canAnswer: this.props.question.duration > secondsDiff
         };
     }
   }else if(type == "freeResponse"){
      this.state = {
         questions: [
           {title: this.props.question.text, //need to inser the dynamic loading options here
           Type:type,
           index:'0'},
         ],
         text: 'Please answer the question here',
         pressedSubmit: false,
         duration: this.props.question.duration,
         lastAsked: this.props.question.lastAsked,
         secondsSinceAsked: secondsDiff,
         canAnswer: this.props.question.duration > secondsDiff
       };
   }

  }

  back() {
    this.props.navigator.pop();
  }

  pressA() {
    if(this.state.pressedSubmit) return;
    this.setState({
      pressedA: true,
      pressedB: false,
      pressedC: false
    });
    console.log("Answer A recorded.. ");
  }

  pressB() {
    if(this.state.pressedSubmit) return;
    this.setState({
      pressedA: false,
      pressedB: true,
      pressedC: false
    });
    console.log("Answer B recorded.. ");
  }

  pressC() {
    if(this.state.pressedSubmit) return;
    this.setState({
      pressedA: false,
      pressedB: false,
      pressedC: true
    });
    console.log("Answer C recorded.. ");
  }

  pressSubmit() {
    if(!this.state.canAnswer) return;
    if(!(this.state.pressedA ^ this.state.pressedB ^ this.state.pressedC)) {
      Alert.alert(
        'Please choose an answer'
        );
      return;
    }
    var answerIndex;
    if(this.state.pressedA) answerIndex = 0;
    else if(this.state.pressedB) answerIndex = 1;
    else if(this.state.pressedC) answerIndex = 2;
    else if(this.state.pressedD) answerIndex = 3;
    Api.db.post('question/answer', {
      questionKey: this.props.question.id,
      answer: this.props.question.answers[answerIndex].id,
      text: null,
    }).catch(function (data) {
      console.log("DATA ::::", data);
    });
    this.setState({
      pressedSubmit: true
    })
    console.log("Submit pressed..");
  }

  goToAnswers(question) {
    if(this.state.canAnswer && !this.state.pressedSubmit) return;
    console.log("HERE INSIDE THE GO TO ANSWER PAGE-> inputText  ",question);
    // console.log(this.props.question);
    this.props.navigator.push({
      //parse in the unique quiz id here.
      //dynamic generaiton of the questins needed.
      name: 'Answers',
      passProps: {question: question}
    });
  }
  recordAnswer(){
     console.log("Answer Recorded");
  }

  renderFreeResponseQuestion(){
    console.log("HERE INSDIE THE renderFreeResponseQuestion");
    return this.state.questions.map((question, i) => {
      console.log("+++++++++++++++++", question.title);
      return (
         <View>
            <Text style={[styles.questionHeader]}>Question</Text>
            <TextWell
             text={question.title}
             color="red"
             style={[styles.textWellSpacing, {marginTop: 10}]}
           />

           <TextInput
               style={{height: 120, borderColor: 'gray', borderWidth: 1,margin:10}}
               multiline = {true}
               numberOfLines = {4}
               onChangeText={(text) => this.setState({text})}
               value={this.state.text}
          />
         </View>
      );
    });
  }
  renderMultipleChoiceQuestion() {

    return this.state.questions.map((question, i) => {
      console.log("+++++++++++++++++", i);
      var solu;
      var answers = this.props.question.answers;
      for(i = 0 ;i < answers.length; i++){
        if(answers[i].correct){
          solu = i;
        }
      }
      this.keyIndex = solu;
      console.log("keykey", this.keyIndex);
      return (
         <View key={i}>
            <Text style={[styles.questionHeader]}>Question</Text>
            <TextWell
             text={question.title}
             color="red"
             style={[styles.textWellSpacing, {marginTop: 10}]}
           />

           <Text>A.)</Text>
           <TouchableOpacity
             style={this.state.pressedA ? styles.qButtonPressed : styles.qButton}
             onPress={this.pressA.bind(this)}
           >
             <Text style={styles.buttonText}>{question.A}</Text>
           </TouchableOpacity>

           <Text>B.)</Text>
           <TouchableOpacity
             style={this.state.pressedB ? styles.qButtonPressed : styles.qButton}
             onPress={this.pressB.bind(this)}
           >
             <Text style={styles.buttonText}>{question.B}</Text>
           </TouchableOpacity>


           <Text>C.)</Text>
           <TouchableOpacity
             style={this.state.pressedC ? styles.qButtonPressed : styles.qButton}
             onPress={this.pressC.bind(this)}
           >
             <Text style={styles.buttonText}>{question.C}</Text>
           </TouchableOpacity>

         </View>

      );
    });
  }

  renderTimer(duration){
    var newTime = new Date();
    var lastAskedTime = new Date(this.state.lastAsked);
    var timeDiff = newTime.getTime() - lastAskedTime.getTime();
    var secondsDiff = timeDiff / 1000;
    var timeLeft = Math.ceil(duration - secondsDiff);
    //var timeLeft = this.state.duration;
    this.timer = setTimeout(() => {
      timeLeft--;
      this.setState({
        timeLeft: timeLeft,
        canAnswer: timeLeft > 0
      });
    }, 1000);
    if(timeLeft <= 0) {
      clearTimeout(this.timer);
      if(this.keyIndex == 0) this.keyIndex = "A";
      else if(this.keyIndex == 1) this.keyIndex = "B";
      else if(this.keyIndex == 2) this.keyIndex = "C";
      else if(this.keyIndex == 3) this.keyIndex = "D";
      return (
        <View>
          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            onPress={this.back.bind(this)}
          >
            <Text>  The answer is: {this.keyIndex} </Text>
            <Text> Press this to go back</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return(
        <View>
          <Text style={styles.timeText}>{this.state.timeLeft}</Text>
        </View>
      );
    }
  }

  renderNavBar(){
     return (
        <View>
           <NavBar
              title="Quiz"
              back={this.back.bind(this)}
              hasBack
           />
        </View>
     );
  }

  renderCourses() {
    return this.state.questions.map((question, i) => {
      console.log("+++++++++++++++++", question.text);
      return (
          <CourseRow
            key={i}
            course={course}
            goTo={this.goToCourse.bind(this)}
          />
      );
    });
  }

  render() {
    console.log("HERE IS THE RENDER FUNCTION");
    console.log("QUESTION",this.props.question);
    var pr = this.props;
    var type = pr.question.type;

    if(type == "multipleChoice"){
      console.log("THE TYPE IS MULTIPLE CHOICE");

      return (
        <View style={styles.container}>
          {this.renderNavBar()}
          {this.renderMultipleChoiceQuestion()}

          <TouchableOpacity
            style={[this.state.canAnswer ? this.state.pressedSubmit ? styles.submitNotPressed : styles.button : styles.submitNotPressed, {marginTop: 20}]}
            onPress={this.pressSubmit.bind(this)}
          >
            <Text>    Submit    </Text>
          </TouchableOpacity>
          {this.renderTimer(this.state.duration)}

        </View>
      );

    }else if(type == "freeResponse"){
      console.log("THE TYPE IS FREE RESPONSE");
      return (
        <View style={styles.container}>
          {this.renderNavBar()}
          {this.renderFreeResponseQuestion()}

          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            onPress={function() {

            }}
          >
            <Text>    Submit    </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            onPress={this.goToAnswers.bind(this,pr.question)}
          >
            <Text>See Answer</Text>
          </TouchableOpacity>

        </View>
      );
    }

  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeText: {
  		textAlign: 'center',
		color: '#999999',
		fontSize: 50,
  },
  buttonText:{
     textAlign: 'center',
    // fontStyle: 'italic',
     color: s.black
 },
  qButton: {
     borderRadius:7,
     borderWidth: .25,
     width: 350,
     height: 40,
     justifyContent:'center',
     alignSelf:'center',
     margin: 20,
     backgroundColor: '#E1FBFF'
  },
  qButtonPressed: {
     borderRadius:7,
     borderWidth: .25,
     width: 350,
     height: 40,
     justifyContent:'center',
     alignSelf:'center',
     margin: 20,
     backgroundColor: '#F3E1FF'
  },
  button: {
    padding: 20,
    backgroundColor: '#F0FFE1',
    alignSelf: 'center',
    borderRadius: 10
  },
  submitNotPressed: {
    padding: 20,
    backgroundColor: '#DBDBD6',
    alignSelf: 'center',
    borderRadius: 10
  },
  textWellSpacing: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  questionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
