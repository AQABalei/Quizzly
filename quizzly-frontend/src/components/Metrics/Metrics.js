import s from 'Metrics/Metrics.scss'
import Api from 'modules/Api.js'
import DonutComponent from 'DonutComponent/DonutComponent.js'
import MetricData from 'MetricData/MetricData.js'
var Promise = require('bluebird');
//var AmCharts = require("@amcharts/amcharts3-react");


export default class Metrics extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    console.log("props.course", props.course);
    this.state = {
      course: props.course,
      sections: props.course.sections,
      students: [],
      quizzes: [],
      questions: [],

      selectedSection: -1,
      selectedStudent: -1,
      selectedQuiz: -1,
      selectedQuestion: -1,

      renderedSection: -1,
      renderedStudent: -1,
      renderedQuiz: -1,
      renderedQuestion: -1,

      allSections: {id: -1, title: "All"},
      allStudents: {id: -1, title: "All"},
      allQuizzes: {id: -1, title: "All"},
      allQuestions: {id: -1, title: "All"},

      isAllSectionsOptionAvailable: true,
      isAllStudentsOptionAvailable: true,
      isAllQuizzesOptionAvailable: true,
      isAllQuestionsOptionAvailable: true,

      canRender: false
    }
  }

  componentDidMount() {
    // console.log("in componentDidMount");
    this.populateDropdowns(this.props.course);
  }

  componentWillReceiveProps(newProps) {
    console.log("in componentWillReceiveProps");
    console.log(newProps.course);
    this.populateDropdowns(newProps.course);
  }

  populateDropdowns(course) {
    console.log("newProps", course);
    if(course.id == -1) return;
    console.log("course.id: ", course.id);
    var me = this;
    $.when(
      Api.db.find('section', {course: course.id}),
      // Api.db.post('student/getStudentsByCourseId/' + course.id),
      Api.db.find('quiz', {course: course.id})
    ).then(function(sections, quizzes) {
      console.log("Sections: ")
      console.log(sections);
      // console.log("sections", sections);
      // console.log("students", students);
      // console.log("quizzes", quizzes);
      me.setState({
        sections: sections[0],
        students: [],
        quizzes: quizzes[0],
        questions: [],
        course: course
      });
    });
  }

  changeSection(event) {
    var me = this;
    var index = event.target.value;
    console.log(event.target.value);
    console.log(this.state.sections);
    console.log(section);
    console.log("Course");
    console.log(this.state.course);
    console.log(this.state.students);
    if(index != -1) { // specific section
      var section = this.state.sections[index];
      Api.db.post('student/getStudentsBySectionId/' + section.id)
      .then(function(students) {
        console.log("here");
        console.log(students);
        console.log(section.id);
        me.setState({
          selectedSection: index,
          selectedStudent: -1,

          students: students,

          isAllSectionsOptionAvailable: true,
          isAllStudentsOptionAvailable: true,
        });
      });
    } else { // all sections
      Api.db.post('student/getStudentsByCourseId/' + this.state.course.id)
      .then(function(students) {
        console.log("students");
        console.log(students);
        me.setState({
          selectedSection: -1,
          selectedStudent: -1,
          students: [],

          isAllSectionsOptionAvailable: true,
          isAllStudentsOptionAvailable: true,
        });
      });
    }
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

  changeQuiz(event) {
    var me = this;
    var index = event.target.value;

    if (index != -1){
      var quiz = this.state.quizzes[index];
      Api.db.find('question', {quiz: quiz.id})
      .then(function(questions) {
        me.setState({
          selectedQuiz: index,
          selectedQuestion: -1,

          questions: questions,
        });
      });
    } else {
      me.setState({
        selectedQuiz: -1,
        selectedQuestion: -1,

        questions: [],
      });
    }
  }

  changeQuestion(event) {
    var index = event.target.value;
    this.setState({
      selectedQuestion: index,
    });
  }

  getMetrics() {
    console.log("getting metrics...");
    this.setState({
      canRender: true,
      renderedSection: this.state.selectedSection == -1 ? -1 : this.state.sections[this.state.selectedSection].id,
      renderedStudent: this.state.selectedStudent == -1 ? -1 : this.state.students[this.state.selectedStudent].id,
      renderedQuiz: this.state.selectedQuiz == -1 ? -1 : this.state.quizzes[this.state.selectedQuiz].id,
      renderedQuestion: this.state.selectedQuestion == -1 ? -1 : this.state.questions[this.state.selectedQuestion].id
    });
  }
  renderMetricsData(){
    if(this.state.canRender){
      console.log("can render");

      console.log(this.state.renderedSection);
      console.log(this.state.renderedStudent);
      console.log(this.state.renderedQuiz);
      console.log(this.state.renderedQuestion);
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

  render() {
  
    var st = this.state;
    var pr = this.props;
    return (
      <div id="metrics" className="quizzlyContent metricsContainer">
        <div className="flexHorizontal">
          <div>
            <div id="sections_div" className="small ml10">Sections</div>
            <select value={this.state.selectedSection} className="dropdown mr10" onChange={this.changeSection.bind(this)}>
              {this.state.isAllSectionsOptionAvailable ? <option value={this.state.allSections.id}>{this.state.allSections.title}</option> : null }
              {this.state.sections.map(function(section, sectionIndex) {
                return <option key={sectionIndex} value={sectionIndex}>{section.title}</option>
              })}
            </select>
          </div>
          <div>
            <div className="small ml10">Students</div>
            <select value={this.state.selectedStudent} className="dropdown mr10" onChange={this.changeStudent.bind(this)}>
              {this.state.isAllStudentsOptionAvailable ? <option value={this.state.allStudents.id}>{this.state.allStudents.title}</option> : null }
              {this.state.students.map(function(student, studentIndex) {
                return <option key={studentIndex} value={studentIndex}>{student.firstName}</option>
              })}
            </select>
          </div>
          <div>
            <div className="small ml10">Quizzes</div>
            <select value={this.state.selectedQuiz} className="dropdown mr10" onChange={this.changeQuiz.bind(this)}>
              {this.state.isAllQuizzesOptionAvailable ? <option value={this.state.allQuizzes.id}>{this.state.allQuizzes.title}</option> : null }
              {this.state.quizzes.map(function(quiz, quizIndex) {
                return <option key={quizIndex} value={quizIndex}>{quiz.title}</option>
              })}
            </select>
          </div>
          <div>
            <div className="small ml10">Questions</div>
            <select value={this.state.selectedQuestion} className="dropdown mr10" onChange={this.changeQuestion.bind(this)}>
              {this.state.isAllQuestionsOptionAvailable ? <option value={this.state.allQuestions.id}>{this.state.allQuestions.title}</option> : null }
              {this.state.questions.map(function(question, questionIndex) {
                return <option key={questionIndex} value={questionIndex}>{question.text}</option>
              })}
            </select>
          </div>
          <button onClick={this.getMetrics.bind(this)}>GET METRICS</button>
        </div>
      </div>
    )
  }
}
