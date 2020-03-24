import s from 'AskStudentQuestion/AskStudentQuestion.scss'
import {browserHistory} from 'react-router'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'

export default class AskStudentQuestion extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      question: {
        answers: [],
        text: "",
        type: "multipleChoice",
        quiz: {}
      },
      selectedAnswer: {},
      freeResponseAnswer: "",
      user: {}
    };
  }

  componentDidMount() {
    $.post('/session')
    .then((user) => {
      this.setState({user: user});
    });
    this.getQuestionFromUrl();
    this.addPusherListener();
  }

  startTimer(duration) {
    var me = this;
    counter = setInterval(timer, 1000); //1000 will run it every 1 second

    function timer() {
      duration--;
      var question = me.state.question;
      question.duration = duration;
      me.setState({question: question}, function() {
        if (duration <= 0) {
          clearInterval(counter);
          browserHistory.push('/s/quizzes');
          return;
        }
      }.bind(this));

      //Do code for showing the number of seconds here
    }
  }

  addPusherListener() {
    var me = this;
    var pusher = new Pusher('638c5913fb91435e1b42', {
      encrypted: true
    });

    var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function(data) {
      console.log("pusher data", data);
      Api.db.findOne('section', data.sectionId)
      .then(function(section) {
        section.students.map(function(student) {
          if(me.state.user.id == student.id) {
            browserHistory.push('/s/question/' + data.questionId + "/" + data.sectionId);
          }
        });
      });
    });
  }

  getQuestionFromUrl() {
    var array = window.location.pathname.split('/');
    var questionId = array[3];
    return Api.db.findOne('question', questionId)
    .then((question) => {
      console.log("question", question);
      question.answers = this.resetSelectedAnswers(question.answers);
      this.startTimer(question.duration);
      this.setState({question: question});
    });
  }

  handleSelectedAnswer(answerIndex) {
    var question = this.state.question;
    question.answers = this.resetSelectedAnswers(question.answers);
    question.answers[answerIndex].isSelected = true;
    this.setState({
      question: question,
      selectedAnswer: question.answers[answerIndex]
    });
  }

  handleFreeResponseChange(e) {
    var freeResponseAnswer = e.target.value;
    this.setState({freeResponseAnswer: freeResponseAnswer});
  }

  resetSelectedAnswers(answers) {
    answers.map(function(answer) {
      return answer.isSelected = false;
    });

    return answers;
  }

  getSelectedAnswer() {
    console.log(">>>>>>>>>> selecting answer");
    var question = this.state.question;
    var selectedAnswer = {};
    question.answers.map((answer) => {
      console.log(">>>>>>>>>> answer in each loop", answer);
      if(answer.isSelected) {
        console.log(">>>>>>>>>> answer that is selected", answer);
        selectedAnswer = answer;
      }
    });
    return selectedAnswer;
  }

  submitAnswer() {
    console.log("submitting answer!");
    var currentUser = {};
    var quiz = this.state.question.quiz;
    var question = this.state.question;
    var answer = {};
    var student = this.state.user;

    switch (question.type) {
      case 'multipleChoice':
        answer = this.getSelectedAnswer();
        break;
      case 'freeResponse':
        break;
    }

    Api.db.post('section/getSectionByStudentAndCourse', {studentId: student.id, courseId: quiz.course})
    .then((section) => {
      return Api.db.create('studentanswer', {
        student: student.id,
        course: quiz.course,
        section: section.id,
        quiz: quiz.id,
        question: question.id,
        answer: answer.id,
        text: this.state.freeResponseAnswer
      });
    })
    .then((studentAnswer) => {
      console.log("studentAnswer saved", studentAnswer);
      clearInterval(counter);
      browserHistory.push('/s/quizzes');
    });
  }

  renderMultipleChoiceSection() {
    return this.state.question.answers.map((answer, answerIndex) => {
      return (
        <div className="row answerRow" key={answerIndex}>
          <div className="columns one pt10">{answer.option + ".)"}</div>
          <div className="columns eleven">
            <div
              className={`answer ${answer.isSelected ? " selected" : ""}`}
              onClick={this.handleSelectedAnswer.bind(this, answerIndex)}
            >
              {answer.text}
            </div>
          </div>
        </div>
      );
    });
  }

  renderFreeResponseSection() {
    var st = this.state;
    return (
      <div className="pl20 pr20">
        <textarea
          className="freeResponse"
          value={st.freeResponseAnswer}
          onChange={this.handleFreeResponseChange.bind(this)}
        />
        <div className="charCount">{st.freeResponseAnswer.length}</div>
      </div>
    );
  }

  renderAnswerSection() {
    var st = this.state;
    switch(st.question.type) {
      case "multipleChoice":
        return this.renderMultipleChoiceSection();
      case "freeResponse":
        return this.renderFreeResponseSection();
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    var me = this;
    return (
      <div className="askStudentQuestionContainer">
        <div>
          <img id="logo" src={Utility.LOGO_IMAGE_PATH} />
          <span id="timer">{st.question.duration}</span>
        </div>

        <div id="studentQuestion">
          <div className="quizTitle">{(st.question.quiz.title + "").toUpperCase()}</div>
          <div className="question">{st.question.text}</div>
          <div className="questionBorder"></div>
          {this.renderAnswerSection()}
          <div
              className="submit"
              onClick={this.submitAnswer.bind(this)}
            >
              SUBMIT
            </div>
        </div>
      </div>
    )
  }
}

var counter;
