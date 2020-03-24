import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet, TableView, ListView
} from 'react-native';

import s from '../modules/Style.js';
import TextWell from '../elements/TextWell'
import Row from '../elements/Row'
import CourseRow from './CourseRow'
import Api from '../modules/Api'
import NavBar from './NavBar.js'

export default class Entrance extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      quizzes: [],
      dataSource: ds.cloneWithRows(['row1', 'row2'])
    };
  }

  back() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    Api.server.find('quiz',{course: this.props.course.id})
    .then((quizzes) => {
      console.log("quizzes", quizzes);
      this.setState({
         quizzes: quizzes,
         dataSource: ds.cloneWithRows(quizzes)
      });
    });
  }

  renderNavBar(){
     return (
        <View>
           <NavBar
             title={this.props.course.title}
             back={this.back.bind(this)}
             hasBack
           />
        </View>
     );
  }

  goToQuestionsList(quiz) {
    this.props.navigator.push({
      //parse in the unique quiz id here.
      //dynamic generaiton of the questins needed.
      name: 'QuestionsList',
      passProps: {quiz: quiz}
    });
  }

  renderCourses(rowData) {
    var quiz = rowData;
    //console.log(">>>>>>>>>>>> Quiz",quiz);
    return (
      <CourseRow
          course={quiz}
          goTo={this.goToQuestionsList.bind(this,quiz)}
       />
    );
  }
  renderTable() {
     return (
        <ListView
           dataSource={this.state.dataSource}
           renderRow={this.renderCourses.bind(this)}
           enableEmptySections={true}
        />
     );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        {this.renderTable()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
