import s from 'StudentQuizzes/StudentQuizzes.scss'
import StudentQuiz from 'StudentQuiz/StudentQuiz.js'
import StudentQuestionModal from 'StudentQuestionModal/StudentQuestionModal.js'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'
import {browserHistory} from 'react-router'
var Promise = require('bluebird');

export default class StudentQuizzes extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    student: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      studentQuizzes: [{title: "", questions: [], course: 0, id: 0}],
      showModal: false,
      modalQuestion: {answers: [], text: "", duration: 0},
      modalInfo: {
        modalType: "ADD_QUIZ",
        title: "Add Quiz",
        index: -1
      }
    };
  }

  componentDidMount() {
    this.getQuizzesFromCourseId(this.props.course.id);
  }

  componentWillReceiveProps(newProps) {
    this.getQuizzesFromCourseId(newProps.course.id);
  }

  getQuizzesFromCourseId(courseId) {
    if(this.props.student == undefined) {
      return;
    }
    var quizIds = [];
    var studentAnswers = [];

    var me = this;
    var all_quizzes = [];
    Api.db.find('quiz', {course: courseId}).then(function(quizzes){
      console.log(quizzes);
      return Promise.each(quizzes, function(quiz){
        return Api.db.post('studentanswer/getMetrics', {student: me.props.student.id, quiz: quiz.id}).then(function(metrics){
          return all_quizzes.push(metrics);
        });
      }).then(function(){
        return me.setState({studentQuizzes: all_quizzes});
      });
    });
  }

  showModal(question) {
    var scope = this;
    Api.db.post('question/getOpenQuestion/', {questionKey: question.id}).then((data) => {
      browserHistory.push('/s/answer/question/' + question.id);
    }).fail(function() {
      scope.setState({
        showModal: true,
        modalQuestion: question
      });
    });
    // Api.db.findOne('question', question.id)
    // .then((question) => {
    //   this.setState({
    //     showModal: true,
    //     modalQuestion: question
    //   });
    // });
  }

  closeModal() {
    this.setState({showModal: false});
  }

  renderStudentQuizzes() {
    console.log(this.state.studentQuizzes);
    return this.state.studentQuizzes.map((studentQuiz, i) => {
      return (
        <div>
          <StudentQuiz
            key={i}
            studentQuiz={studentQuiz}
            studentQuizIndex={i}
            showModal={this.showModal.bind(this)}
          />
        </div>
      );
    });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="studentQuizzesContainer">
        <div className="taken-quizzes">Taken Quizzes</div>
        <div id="quizzes" className="p20 quizzlyContent panelHeader">
          {this.renderStudentQuizzes()}
        </div>
        {st.showModal ?
          <StudentQuestionModal
            question={st.modalQuestion}
            closeModal={this.closeModal.bind(this)}
          />
          :
          null
        }
      </div>
    )
  }
}
