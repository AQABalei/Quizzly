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
import QuizzRow from './QuizzRow'
import Api from '../modules/Api'
import NavBar from './NavBar.js'

export default class Entrance extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      quizzes: [],
      dataSource: ds.cloneWithRows([])
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
      for(var i = quizzes.length - 1; i >= 0; i--) {
        var indices = [];
        for(var j = 0; j < quizzes[i].questions.length; j++) {
          if(typeof quizzes[i].questions[j].lastAsked == "undefined") {
            indices.push(j);
          }
        }
        if(indices.length == quizzes[i].questions.length) {
          quizzes.splice(i, 1);
        }
        // if(typeof quizzes[i].questions[0].lastAsked == "undefined") {
        //   indices.push(i);
        // }
      }
      // for(var i = indices.length - 1; i >= 0; i--) {
      //   quizzes.splice(indices[i], 1);
      // }
      console.log("quizzes after removal", quizzes);
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
             title={"Quizzes for " + this.props.course.title}
             back={this.back.bind(this)}
             currentPage={this}
             courseTitle={this.props.course.title}
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
      <QuizzRow
          quiz={quiz}
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
