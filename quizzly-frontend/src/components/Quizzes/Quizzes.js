import s from 'Quizzes/Quizzes.scss'
import Quiz from 'Quiz/Quiz.js'
import AddCourseBody from 'AddCourseBody/AddCourseBody.js'
import AddQuizBody from 'AddQuizBody/AddQuizBody.js'
import AddQuestionBody from 'AddQuestionBody/AddQuestionBody.js'
import AddStudentsBody from 'AddStudentsBody/AddStudentsBody.js'
import Modal from 'elements/Modal/Modal.js'
import Api from 'modules/Api.js'
import Promise from 'bluebird'
import dateformat from 'dateformat'
import timeago from 'time-ago'
var ta = timeago();

export default class Quizzes extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      quizzes: [{title: "", questions: [], course: 0, id: 0}],
      showModal: false,
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
    var me = this;
      Api.db.find("quiz", { course: courseId })
      .then(function(quizzes) {
        console.log("quizzes", quizzes);

        if(quizzes == undefined) return; // if there are no courses, then there are no sections
        me.setState({
          quizzes: quizzes
        });
      });
  }

  showQuizModal(quizIndex, quizTitle) {
    var modalInfo = this.state.modalInfo;
    modalInfo.title = quizTitle; // either "Add Quiz" or "Edit Quiz"
    modalInfo.modalType = "ADD_QUIZ";
    modalInfo.quizIndex = quizIndex;
    this.setState({
      showModal: true,
      modalInfo: modalInfo
    });
  }

  showQuestionModal(quizIndex, questionIndex) {
    var quiz = this.state.quizzes[quizIndex];
    var modalInfo = this.state.modalInfo;
    modalInfo.title = `Question in ${quiz.title}`;
    modalInfo.modalType = "ADD_QUESTION";
    modalInfo.quizIndex = quizIndex;
    modalInfo.questionIndex = questionIndex;
    this.setState({
      showModal: true,
      modalInfo: modalInfo
    });
  }

  showQuestionInModal(quizIndex, questionIndex) {
    this.showQuestionModal(quizIndex, questionIndex);
  }

  closeModal() {
    this.setState({showModal: false});
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  } 

  addQuizToCourse(quiz, quizIndex) {
    console.log("Adding quiz '" +  quiz.title + "' in course " + this.props.course.title);
    if(quiz.title.length == 0) {
      return;
    }
    if(quizIndex > -1) {
      Api.db.update('quiz', quiz.id, { title: quiz.title })
      .then((quiz) => {
        console.log(quiz);
        var quizzes = this.state.quizzes;
        quizzes[quizIndex] = quiz;
        this.setState({quizzes: quizzes});
        this.closeModal();
      });
    } else {
      Api.db.create('quiz', { title: quiz.title, course: this.props.course.id })
      .then((quiz) => {
        console.log(quiz);

        // Create attendance question
        var question = {
          type: "multipleChoice",
          duration: 30,
          text: "",
          answers: [
            {option: "A", text: this.makeid(), correct: false},
            {option: "B", text: this.makeid(), correct: false},
            {option: "C", text: this.makeid(), correct: false}
          ]
        };

        var correctAnswer= Math.floor(Math.random() * 3);
        question.answers[correctAnswer].correct = true;

        Api.db.create('question', {
          text: "Attendance Question",
          type: question.type,
          quiz: quiz.id,
          answers: question.answers,
          duration: question.duration,
          isAttendanceQuestion: true
        })
        .then((createdQuestion) => {
          quiz.questions.push(createdQuestion);
          var quizzes = this.state.quizzes;
          quizzes.push(quiz);

          this.setState({quizzes: quizzes});
          this.closeModal();
        });


        this.closeModal();
      });
    }
  }

  addQuestionToQuiz(question, quizIndex, questionIndex) {
    if(questionIndex > -1) {
      this.updateQuestion(question, quizIndex, questionIndex);
    } else {
      this.createQuestion(question, quizIndex, questionIndex);
    }
  }

  updateQuestion(newQuestion, quizIndex, questionIndex) {
    var me = this;
    var quizzes = this.state.quizzes;
    Api.db.update('question', newQuestion.id, {text: newQuestion.text, type: newQuestion.type, duration: newQuestion.duration})
    .then((question) => {
      quizzes[quizIndex].questions[questionIndex] = question;
      this.setState({quizzes: quizzes});
      Promise.each(newQuestion.answers, function(answer) {
        if(answer.id == undefined && answer.text.length == 0) {
          return $.when(null);
        } else if(answer.id == undefined) {
          return this.crudAnswer('create', answer, question);
        } else if(answer.text.length == 0) {
          return Api.db.post('answer/destroy/' + answer.id);
        } else {
          console.log("here");
          return me.crudAnswer('update', answer, question);
        }
      })
      .then(() => {
        this.closeModal();
      });
    });
  }

  createQuestion(question, quizIndex, questionIndex) {
    var quizzes = this.state.quizzes;

    for(var i = 0; i < question.answers.length; ++i) { // this removes empty answers from the array
      if(question.answers[i].text.length == 0) {
        question.answers.splice(i, 1);
        --i;
      }
    }

    Api.db.create('question', {
      text: question.text,
      type: question.type,
      quiz: quizzes[quizIndex].id,
      answers: question.answers,
      duration: question.duration
    })
    .then((createdQuestion) => {
      quizzes[quizIndex].questions.push(createdQuestion);
      this.setState({quizzes: quizzes});
      this.closeModal();
    });
  }

  crudAnswer(operation, answer, question) {
    var route = '';
    route = operation == 'create' ? 'answer/create' : 'answer/update/' + answer.id;
    switch(operation) {
      case 'create':
        route = 'answer/create';
        break;
      case 'update':
        route = 'answer/update/' + answer.id;
        break;
    }
    console.log("this is the route", route);
    return Api.db.post(route, {
      text: answer.text,
      correct: answer.correct,
      option: answer.option,
      question: question.id
    });
  }
  duplicateQuizOnCourse(quizIndex){
    var me = this;
    console.log("here");
    console.log(this.state.quizzes[quizIndex]);
    Api.db.post('quiz/duplicateQuiz', {
      quiz: me.state.quizzes[quizIndex]
    }).then(function(quiz){
      console.log(quiz);
      me.getQuizzesFromCourseId(me.props.course.id);
    });
  }
  deleteQuizFromCourse(quizIndex) {
    var quizzes = this.state.quizzes;
    Api.db.post('quiz/destroy/' + quizzes[quizIndex].id)
    .then(() => {
      var questions = quizzes[quizIndex].questions;
      if(questions.length == 0) return $.when(null);
      var answerIds = [];
      var questionIds = [];
      questions.map(function(question){
        questionIds.push(question.id);
        if(question.answers != undefined) {
          question.answers.map(function(answer) {answerIds.push(answer.id);});
        }
      });
      return $.when(
        Api.db.post('question/multidestroy', {ids: questionIds}),
        Api.db.post('answer/multidestroy', {ids: answerIds})
      );
    })
    .then(() => {
      quizzes.splice(quizIndex, 1);
      this.setState({quizzes: quizzes});
      this.closeModal();
    });
  }

  deleteQuestionFromQuiz(quizIndex, questionIndex) {
    var quizzes = this.state.quizzes;
    var question = quizzes[quizIndex].questions[questionIndex];
    Api.db.post('question/destroy', {id: question.id})
    .then(() => {
      console.log("deleting", question);
      var answerIds = [];
      if(question.answers != undefined) {
        answerIds = question.answers.map(function(answer) {return answer.id;});
        return Api.db.post('answer/multidestroy', {ids: answerIds});
      }
      return $.when(null);
    })
    .then(() => {
      quizzes[quizIndex].questions.splice(questionIndex, 1);
      this.setState({quizzes: quizzes});
      this.closeModal();
    });
  }

  askQuestion(quizIndex, questionIndex, sectionId) {
    // askPrev
    var question = this.state.quizzes[quizIndex].questions[questionIndex];
    return Api.db.post('question/askedPrev/', {question: question.id, section: sectionId})
      .then( (res)=> {
        if (res.asked !== undefined) {
          let q = confirm("Warning! This question has already been asked to this section. Asking again will delete previous answers. Are you sure?")
          if (q) {
            return Api.db.post('question/ask/', {question: question.id, section: sectionId})
              .then(() => {
                console.log("Asked question success!")
                return true;
              })
          } else {
            return false;
          }
        }
        else if (res === 'OK') {
          return Api.db.post('question/ask/', {question: question.id, section: sectionId})
            .then(() => {
              console.log("Asked question success!")
              return true;
            })
      }})
      return false;
    // Proceed
    /*return Api.db.post('question/ask/', {question: question.id, section: sectionId})
    .then(() => {
      console.log("asked question success!");
      return null;
    });*/

  }

  getCurrentQuestion() {
    var st = this.state;
    return st.quizzes[st.modalInfo.quizIndex].questions[st.modalInfo.questionIndex];
  }

  getLastAskedDate() {
    var question = this.getCurrentQuestion();

    if(question && question.lastAsked) {
      // return dateformat(question.lastAsked, "dddd, mmmm d, yyyy @ h:MM tt");
      console.log(">>>>>>>>question.lastAsked", question.lastAsked);
      return `– asked ${ta.ago(question.lastAsked)}`;
    }
    return '- never asked';
  }

  renderModalHeader() {
    return (
      <div className="flex">
        {this.state.modalInfo.title}&nbsp;
        {this.state.modalInfo.title == 'Add Quiz' ?
          null
          :
          <span className="lastAsked">
            {this.getLastAskedDate()}
          </span>
        }
      </div>
    );
  }

  renderModalBody() {
    var st = this.state;
    switch (st.modalInfo.modalType) {
      case "ADD_QUIZ":
        return <AddQuizBody
          addQuizToCourse={this.addQuizToCourse.bind(this)}
          quizIndex={st.modalInfo.quizIndex}
          quizzes={st.quizzes}
        />;
      case "ADD_QUESTION":
        return <AddQuestionBody
          addQuestionToQuiz={this.addQuestionToQuiz.bind(this)}
          quizzes={st.quizzes}
          quizIndex={st.modalInfo.quizIndex}
          questionIndex={st.modalInfo.questionIndex}
        />;
    }
  }

  renderModal() {
    var st = this.state;
    return (
      <Modal
        title={this.renderModalHeader()}
        body={this.renderModalBody()}
        closeModal={this.closeModal.bind(this)}
      />
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="quizzesContainer">
        <div className="quizzesBody">
          {this.state.quizzes.map((quiz, i) => {
            return (
              <Quiz
                quiz={quiz}
                key={i}
                quizIndex={i}
                deleteQuizFromCourse={this.deleteQuizFromCourse.bind(this)}
                deleteQuestionFromQuiz={this.deleteQuestionFromQuiz.bind(this)}
                showQuestionModal={this.showQuestionModal.bind(this)}
                showQuestionInModal={this.showQuestionInModal.bind(this)}
                showQuizModal={this.showQuizModal.bind(this)}
                askQuestion={this.askQuestion.bind(this)}
                duplicateQuizOnCourse={this.duplicateQuizOnCourse.bind(this)}
              />
            );
          }, this)}
          <div
            className="addEntityButton"
            onClick={this.showQuizModal.bind(this, -1, "Add Quiz")}
          >
            ADD QUIZ
          </div>
        </div>
        {st.showModal ? this.renderModal() : null}
      </div>
    )
  }
}
