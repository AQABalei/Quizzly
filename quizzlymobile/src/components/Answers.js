import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import s from '../modules/Style.js';
import TextWell from '../elements/TextWell'
import Row from '../elements/Row'
import CourseRow from './CourseRow'
import Api from '../modules/Api'
import NavBar from './NavBar.js'

export default class Answers extends Component {
  constructor(props) {
    super(props);
    var question = this.props.question;
    var answers = this.props.question.answers;

    //find the solution answer and store it to the state
    var solu;
    for(i = 0 ;i < answers.length; i++){
      if(answers[i].correct){
        solu = i;
      }
    }

    this.state = {
        answers:[{
          question:question.text,
          option:answers[solu].option,
          text  :answers[solu].text
        },
      ]};

  }

  back() {
    this.props.navigator.pop();
  }

  componentDidMount() {
  }

  goToCourse(course) {
  }

  renderTextWells() {
    var st = this.state.answers[0];
    return (
      <View>
        <Text>3.)</Text>
        <TextWell
          text={st.question}
          color="green"
          style={[styles.textWellSpacing, {marginTop: 10}]}
        />
        <Text>{st.option}</Text>
        <TextWell
          text={st.text}
          color="red"
          style={styles.textWellSpacing}
        />
      </View>
    );
  }

  renderNavBar(){
     return (
        <View>
           <NavBar
             title={"Answers"}
             back={this.back.bind(this)}
             hasBack
           />
        </View>
     );
  }

  renderCourses() {
    return this.state.courses.map((course, i) => {
      console.log("+++++++++++++++++", course.title);
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
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        {this.renderTextWells()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    padding: 20,
    backgroundColor: 'green',
    alignSelf: 'center',
    borderRadius: 10
  },
  textWellSpacing: {
    marginHorizontal: 10,
    marginBottom: 10
  },
});
