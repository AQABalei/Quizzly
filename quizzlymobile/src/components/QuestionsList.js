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
import QuestionRow from './QuestionRow'
import Api from '../modules/Api'
import NavBar from './NavBar.js'

export default class Entrance extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      questions: [],
      dataSource: ds.cloneWithRows(['row1', 'row2'])
    };
  }

  back() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    Api.server.find('question',{quiz: this.props.quiz.id})
    .then((questions) => {
      console.log("question", questions);
      var indices = [];
      for(var i = 0; i < questions.length; i++) {
        if(questions[i].lastAsked == null) {
          indices.push(i);
        }
      }
      for(var i = indices.length - 1; i >= 0; i--) {
        questions.splice(indices[i], 1);
      }
      this.setState({
         questions: questions,
         dataSource: ds.cloneWithRows(questions)
      });
    });
  }

  renderNavBar(){
     return (
        <View>
           <NavBar
             title={this.props.quiz.title}
             back={this.back.bind(this)}
             currentPage = {this}
             quizTitle = {this.props.quiz.title}
             hasBack
           />
        </View>
     );
  }

  goToQuestions(question) {
    this.props.navigator.push({
      //parse in the unique question id here.
      //dynamic generaiton of the questins needed.
      name: 'Questions',
      passProps: {question: question}
      //, {...this.state}
    });
  }


  renderCourses(rowData) {
    var question = rowData;
    //console.log(">>>>>>>>>>>> Question",question);
    return (
      <QuestionRow
          question={question}
          goTo={this.goToQuestions.bind(this, question)}
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
