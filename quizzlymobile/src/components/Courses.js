'use strict';
import React, { Component } from 'react';
import {
   Text,
   View,
   TouchableHighlight,
   StyleSheet,
   TableView,
   ListView,
   Alert
} from 'react-native';

import TextWell from '../elements/TextWell'
import Row from '../elements/Row'
import CourseRow from './CourseRow'
import Api from '../modules/Api'
import Session from '../modules/Session'
import s from '../modules/Style.js';
import LinearGradient from 'react-native-linear-gradient';
import NavBar from './NavBar.js'

export default class Entrance extends Component {
   constructor(props) {
      super(props);
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
         courses: [],
         dataSource: ds.cloneWithRows([])
      };
   }

   back() {
      this.props.navigator.pop();
   }

   componentDidMount() {

      console.log("Mounting...");
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
      var courseQuery = {id: Session.student.id};
      console.log("courseQuery", courseQuery);
      Api.server.find('student/getStudentCourses', courseQuery)
      .then((courses) => {
        if(courses.length == 0) {
          Alert.alert (
            "Not currently enrolled in any courses."
          );
        }
        this.setState({
          courses: courses,
          dataSource: ds.cloneWithRows(courses)
        });
      });
   }

   goToCourse(course) {
      console.log("course", course);
      this.props.navigator.push({
         name: 'QuizzList',
         passProps: {course: course, title:course.title, state:this.state}
      });
      //this.props.navigator.push({
        //name: 'Course',
        //passProps: {course: course, title:course.title, state:this.state }
      //});

   }

   renderNavBar(){
      return (
         <View>
            <NavBar
               title="Courses"
               back={this.back.bind(this)}
               currentPage = {this}
               hasBack
            />
         </View>
      );
   }

   renderCourses(rowData) {
     var course = rowData;
     return (
       <CourseRow
           course={course}
           goTo={this.goToCourse.bind(this)}
        />
     );
   }
   renderTable() {
      return (
         <ListView
            style={styles.main}
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
   main: {
     marginTop: 16,
   },
   button: {
      //padding: 20,
      backgroundColor: 'green',
      alignSelf: 'center',
      borderRadius: 10
   },
   textWellSpacing: {
      marginHorizontal: 10,
      marginBottom: 10
   },
});
