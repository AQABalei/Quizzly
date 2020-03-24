import s from 'Export/Export.scss'
import Api from 'modules/Api.js'
import DonutComponent from 'DonutComponent/DonutComponent.js'
import MetricData from 'MetricData/MetricData.js'
import {CSVLink, CSVDownload} from 'react-csv';
import { resolve } from 'url';
import 'react-table/react-table.css'
var ReactTable = require('react-table').default

var Promise = require('bluebird');

var AmCharts = require("@amcharts/amcharts3-react");

export default class Export extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    // console.log("props.course", props.course);
    this.state = {
      data: [{'option': 'none', 'count': 0}] ,
      course: props.course,
      sections: props.course.sections,
      students: [],
      quizzes: [],
      questions: [],

      results: [],

      selectedSection: -1,
      selectedStudent: -1,
      selectedQuiz: -1,
      selectedQuestion: -1,

      renderedSection: -1,
      renderedStudent: -1,
      renderedQuiz: -1,
      renderedQuestion: -1,

      allSections: {id: -1, title: "Please Select"},
      allStudents: {id: -1, title: "All"},
      allQuizzes: {id: -1, title: "All"},
      allQuestions: {id: -1, title: "All"},

      isAllSectionsOptionAvailable: true,
      isAllStudentsOptionAvailable: true,
      isAllQuizzesOptionAvailable: true,
      isAllQuestionsOptionAvailable: true,

      tableData: {
        columns: [{
          Header: "Students",
          columns: [
              {
                Header: 'First Name',
                accessor: 'firstName', // String-based value accessors!
              }, {
                Header: 'Last Name',
                accessor: 'lastName',
              }, {
                Header: "Email",
                accessor: 'email',
              },
            ]
          }
        ],
        data: []
      },

      canRender: false
    }
  }

  componentDidMount() {
    // console.log("in componentDidMount");
    this.populateDropdowns(this.props.course);
  }

  componentWillMount() {
    this.populateDropdowns(this.props.course);
  }


  componentWillReceiveProps(newProps) {
    // console.log("in componentWillReceiveProps");
    // console.log(newProps.course);
    this.populateDropdowns(newProps.course);
  }

  populateDropdowns(course) {
    console.log("newProps", course);
    if(course.id == -1) return;
    // console.log("course.id: ", course.id);
    var me = this;
    $.when(
      Api.db.find('section', {course: course.id}),
      // Api.db.post('student/getStudentsByCourseId/' + course.id),
      Api.db.find('quiz', {course: course.id})
    ).then(function(sections, quizzes) {
      // console.log("Sections: ")
      // console.log(sections);
      // console.log("sections", sections);
      // console.log("students", students);
      // console.log("quizzes", quizzes);
      me.setState({
        sections: sections[0],
        students: [],
        quizzes: quizzes[0],
        course: course
      }, me.setAllQuestions.bind(me));

    });
  }

  changeStudent(event) {
    var me = this;
    var index = event.target.value;
    console.log(this.state.students);
      console.log(this.state.sections);
    if(index != -1) { // specific student
      // var student = this.state.students[index];
      // Api.db.post('section/getSectionByStudentAndCourse/', {courseId: this.state.course.id, studentId: student.id})
      // .then(function(sections) {
      //   console.log(sections);
      //   me.setState({
      //     selectedStudent: index,
      //     sections: [sections],
      //   });
      // });
      this.setState({
        selectedStudent: index
      })
    } else { // all students
      Api.db.find('section', {course: this.state.course.id})
      .then(function(sections) {
        me.setState({
          selectedStudent: -1,
          selectedSection: -1,
          sections: sections,
        });
      });
    }
  }

  changeSection(event) {
    var me = this;
    var index = event.target.value;
    // console.log(event.target.value);
    // console.log(this.state.sections);
    // console.log(section);
    // console.log("Course");
    // console.log(this.state.course);
    // console.log(this.state.students);
    if(index != -1) { // specific section
      var section = this.state.sections[index];
      Api.db.post('student/getStudentsBySectionId/' + section.id)
      .then(function(students) {
        // console.log("here");
        // console.log(students);
        // console.log(section.id);
        me.setState({
          selectedSection: index,
          selectedStudent: -1,

          students: students,

          isAllSectionsOptionAvailable: true,
          isAllStudentsOptionAvailable: true,
        }, me.getStudentQuizResults.bind(me));
        //console.log(me)
      });
    } else { // all sections
      Api.db.post('student/getStudentsByCourseId/' + this.state.course.id)
      .then(function(students) {
        // console.log("students");
        // console.log(students);
        me.setState({
          selectedSection: -1,
          selectedStudent: -1,
          students: [],

          isAllSectionsOptionAvailable: true,
          isAllStudentsOptionAvailable: true,
        });
        //me.getStudentQuizResults.bind(me)
      });
    }
  }

  changeQuiz(event) {
    var me = this;
    var index = event.target.value;

    if (index != -1){
      var quiz = this.state.quizzes[index];
      Api.db.find('question', {quiz: quiz.id})
      .then(function(questions) {
        // console.log("questions", questions)
        me.setState({
          selectedQuiz: index,
          selectedQuestion: -1,

          questions: questions,
        });
        console.log("mememe")
        //me.getStudentQuizResults.bind(me)
      }, () => {me.getStudentQuizResults.bind(me);});
    } else {
      me.setState({
        selectedQuiz: -1,
        selectedQuestion: -1,

        questions: [],
      }, me.getStudentQuizResults.bind(me));
      //me.setAllQuestions().then()
      //me.getStudentQuizResults.bind(me)
    }
  }
/*
  changeQuestion(event) {
    var index = event.target.value;
    this.setState({
      selectedQuestion: index,
    });
  }

  getMetrics() {
  }

  getQuestionMetrics() {
    let questionId = this.state.questions[this.state.selectedQuestion].id
    // console.log('questionid', questionId)
    Api.db.post('metrics/' + questionId, {}).then(function(data){
        // Update Amcharts
        // console.log("DATA:", data)
        this.setState({
            data: data
        })
    }.bind(this));
  }

  getQuizMetrics() {
    let questionId = this.state.questions[this.state.selectedQuestion].id
    // console.log(this.state.selectedQuiz);
    Api.db.post('metrics/' + questionId, {}).then(function(data){
        // Update Amcharts
        // console.log("DATA:", data)
        this.setState({
            data: data
        })
    });
  }

  getQuizTable() {
    // /answer-table/:section/:quiz'
    let quizID = this.state.quizzes[this.state.selectedQuiz].id
    let sectionID = this.state.sections[this.state.selectedSection].id
    Api.db.post('answer-table/' + sectionID + '/' + quizID, {}).then(function(data){
        // console.log("DATA:", data)
        this.setState({
            tableData: data
        })
        // console.log(tableData)
    }.bind(this));
  }

  renderAmChart() {
      return (
        <AmCharts.React
            ref={(e) => {if (e) {this.ch = e}}}
                style={{
                width: "100%",
                height: "400px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": this.state.data,
                    "gridAboveGraphs": true,
                    "startDuration": 1,
                    "graphs": [ {
                      "balloonText": "[[category]]: <b>[[value]]</b>",
                      "fillAlphas": 0.9,
                      "lineAlpha": 0.2,
                      "type": "column",
                      "valueField": "count",
                      "fixedColumnWidth": 55,
                      "fillColors": "#32F0A8",
                    } ],
                    "depth3D": 20,
                    "angle": 30,
                    "chartCursor": {
                      "categoryBalloonEnabled": false,
                      "cursorAlpha": 0,
                      "zoomable": false
                    },
                    "categoryField": "option",
                    "categoryAxis": {
                      "gridPosition": "start",
                      "gridAlpha": 0,
                      "tickPosition": "start",
                      "tickLength": 20
                    },
                    "export": {
                      "enabled": true
                    }
                }}
            />
     )
  }

  renderMetricsData(){
    if(this.state.canRender){
      return (
        <MetricData
          section={this.state.renderedSection}
          student={this.state.renderedStudent}
          quiz={this.state.renderedQuiz}
          question={this.state.renderedQuestion}
          course={this.props.course.id}
        />
      )
    }
  }

  renderSectionTable() {
    // if(this.state.canRender){
    // console.log(this.state.tableData)
    console.log(this.state)
    console.log("TABLE UPDATE")
    return (
      <ReactTable
        data={this.state.tableData.data}
        columns={this.state.tableData.columns}
        filterable
        className="-striped -highlight"
        defaultSorted={[ { id: "lastName", desc: false } ]}
        noDataText="Select a section and quiz from above"
      />
    )
    // }
  }
*/

  getJsonQuestionAndUserAnswers(questionID, studentEmail) {
    //return Api.db.post('question/getJsonQuestionAndUserAnswers', { question: questionID, student: studentEmail})
    //.then((res) => {
      //return Api.db.post('session', user);
    //  console.log("Json ", res);
    //})
    return new Promise(resolve => {
      Api.db.post('question/getJsonQuestionAndUserAnswers', { question: questionID, student: studentEmail})
      .then(res => {resolve(res)})
    })
  }

  getQuestionAndUserAnswer(questionID, studentEmail) {
    return Api.db.post('question/getQuestionAndUserAnswer', { question: questionID, student: studentEmail})
    //.then((res) => {
      //return Api.db.post('session', user);
    //  console.log("hhy ", res);
    //  return res
    //})
  }
/*
  getStudentQuizResults() {
    stuents = this.state.students
    quizzes = this.state.selectedQuiz == -1 ? this.state.quizzes : [this.state.quizzes[this.state.selectedQuiz]]

    header = ['name', 'email']
    for (quiz in quizzes) {
      Api.db.find('question', {quiz: quiz.id})
      .then(function(questions) {
        // console.log("questions", questions)
        header.push(quiz.title)
        for (student in students) {
          correctNumber = 0;
          for (question in questions) {
            answer = this.getQuestionAndUserAnswer(question.id, student.email);
            if (Object.prototype.toString.call(answer) == "[object Object]") {
              answer.
            }
          }
        }
      }).bind(this)
    }


    quizzes.forEach(quiz => {header.push(quiz.title)})
    result = [

    ]
  }
*/

getQuestionsByQuiz(quiz) {
  return new Promise(resolve => {
    Api.db.find('question', {quiz: quiz.id}).then(questions => {resolve(questions)})
  })
}

setAllQuestions() {
  //const quizzes = this.state.selectedQuiz == -1 ? this.state.quizzes : [this.state.quizzes[this.state.selectedQuiz]]
  const quizzes = this.state.quizzes
  Promise.all(quizzes.map(quiz => this.getQuestionsByQuiz(quiz))).then(questionsInQuizzes => {
    console.log(questionsInQuizzes)
    this.setState({
      questions: questionsInQuizzes
    })
  })
}

getStudentResults(student) {
  let result = {firstName: student.firstName, lastName: student.lastName, Email: student.email};
  let questions = []
  const questionsInQuizzes = this.state.questions
  questionsInQuizzes.forEach(questionInQuiz => {
    questions.push.apply(questions, questionInQuiz)
    result[questionInQuiz[0].quiz.title] = 0
  })
  console.log("qqq", questions)
  return new Promise(resolve => {
    Promise.all(questions.map(question => this.getJsonQuestionAndUserAnswers(question.id, student.email)))
    .then(res => {
      for (const i in res) {
        if (res[i].hasOwnProperty("user_answer")) {
          console.log("has", res[i], student.firstName)
          if (res[i].user_answer.answer.correct == true) {
            ++result[questions[i].quiz.title]
            console.log("true")
          }
        }
      }
      console.log("result ", result)
      resolve(result)
    })
  })
}

getStudentQuizResults() {
  //console.log(this.state.selectedSection)
  if (this.state.selectedSection == -1) return;
  const students = this.state.students
  Promise.all(students.map(student => this.getStudentResults(student)))
  .then(results => {
    console.log("resssss ", results)
    console.log(Object.prototype.toString.call(results[0]))
    this.setState({
      results: results
    })
  })
}

/*
getStudentQuizResults() {
  console.log("start", this.state)
  if (this.state.selectedSection == -1) return;
  //console.log(this)
  const students = this.state.students
  const quizzes = this.state.selectedQuiz == -1 ? this.state.quizzes : [this.state.quizzes[this.state.selectedQuiz]]

  Promise.all(quizzes.map(quiz => this.getQuestionsByQuiz(quiz))).then(questions => {
    console.log(questions)
  })
  return;
  let results = []
  students.forEach(student => {
    results.push({firstname: student.firstName, lastname: student.lastName, email: student.email})
  });
  //header = ['name', 'email']
  console.log("hahahahah", this.state.selectedQuiz)

  //console.log(this.state.quizzes)
  //console.log(Object.prototype.toString.call(quizzes))
  const allPromises = quizzes.map(quiz => new Promise(resolve => {
    results.forEach(result => {result[quiz.title] = 0})
    console.log(quiz)
    Api.db.find('question', {quiz: quiz.id})
    .then((questions) => {
      console.log("questions", questions)
      //header.push(quiz.title)
      questions.forEach(question => {
        results.forEach(result => {
          this.getJsonQuestionAndUserAnswers(question.id, result.email).then(res => {
            if (res.hasOwnProperty("user_answer")) {
              console.log("has", res)
              if (res.user_answer.answer.correct == true) {
                ++result[quiz.title]
                console.log("true")
              }
            }
          })

        })
      })

    }).then(() => {resolve()})
  }))

  Promise.all(allPromises).then(() => {console.log("results ", results)})
}
*/

renderResultsTable() {
  // if(this.state.canRender){
  // console.log(this.state.tableData)
  console.log(this.state)
  console.log("TABLE UPDATE")
  const data = this.state.results
  const columns = [
    {
      Header: "Students",
      columns:[
        {Header: "First Name", accessor: "firstName"},
        {Header: "Last Name", accessor: "lastName"},
        {Header: "Email", accessor: "Email"}
      ]
    },
    {
      Header: "Results",
      columns: this.state.quizzes.map(quiz => {return {Header: quiz.title, accessor: quiz.title}})
    }
  ]

  console.log(columns);
  console.log(data);
  return (
    <ReactTable
      data={data}
      columns={columns}
      filterable
      className="-striped -highlight"
      defaultSorted={[ { id: "lastName", desc: false } ]}
      noDataText="Select a section from above"
    />
  )
  // }
}

  render() {
    var resultArray = [
      ['firstname', 'lastname', 'email'] ,
      ['Ahmed', 'Tomi' , 'ah@smthing.co.com'] ,
      ['Raed', 'Labes' , 'rl@smthing.co.com'] ,
      ['Yezzi','Min l3b', 'ymin@cocococo.com']
    ]

    /*
    console.log("apiapiapi ", this.state.sections)
    console.log("question ", this.state.questions)
    console.log("students ", this.state.students)
    if (this.state.questions.length > 0 && this.state.students.length > 0) {
      console.log(this.state.questions[0].id)
      console.log(this.state.students[0].email)
      this.getQuestionAndUserAnswer(this.state.questions[0].id, this.state.students[0].email);
    }
    */
    //this.getStudentQuizResults()
    //this.getStudentQuizResults()
    //this.getJsonQuestionAndUserAnswers(3, "byargeone@gmail.com").then((res) => {console.log(res)})
    console.log(this.state.results)
    return (
      <div className="metrics-body">

        <div className="metrics-menu">
          <div>
            <div id="sections_div" className="small ml10">Sections</div>
            <select value={this.state.selectedSection} className="dropdown mr10 select-style" onChange={this.changeSection.bind(this)}>
              {this.state.isAllSectionsOptionAvailable ? <option value={this.state.allSections.id}>{this.state.allSections.title}</option> : null }
              {this.state.sections.map(function(section, sectionIndex) {
                return <option key={sectionIndex} value={sectionIndex}>{section.title}</option>
              })}
            </select>
          </div>

          <button className="rounded-button">
            <CSVLink data={this.state.results}
              separator={","}
              filename={"my-file.csv"}
              className="download-button">
                DOWNLOAD CSV
            </CSVLink>
          </button>
          <div className="helpText">
            Please turn off your ad block for this
          </div>

        </div>

        <div className="metrics-table">
            {this.renderResultsTable()}
        </div>
      </div>
    )
  }
}
