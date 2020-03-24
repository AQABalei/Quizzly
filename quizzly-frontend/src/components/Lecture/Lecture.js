import s from 'Lecture/Lecture.scss'
import Api from 'modules/Api.js'

export default class Lecture extends React.Component {
  static propTypes = {
    lecture: React.PropTypes.object.isRequired,
    lectureIndex: React.PropTypes.number.isRequired,
    showLectures: React.PropTypes.func.isRequired,
    lectureChange: React.PropTypes.func.isRequired,
    saveLecture: React.PropTypes.func.isRequired,
    addQuizToLecture: React.PropTypes.func.isRequired,
    addQuestionToLecture: React.PropTypes.func.isRequired,
    removeItemFromLecture: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
      search: '',
      isQuizzes: true,
    }
  }

  componentWillMount() {
    // $.when(
    //   Api.db.find('quiz', {course: this.props.course.id}),
    //   Api.db.find('question') // TODO: get all questions of professor
    // )
    // .then((quizzes, questions) => {
    //   this.setState({
    //     quizzes: quizzes[0],
    //     questions: questions[0],
    //   });
    // });
    this.getQuizzes(this.props.course.id);
  }

  componentWillReceiveProps(newProps) {
    this.getQuizzes(newProps.course.id);
  }

  getQuizzes(courseId) {
    Api.db.find('quiz', {course: courseId})
    .then((quizzes) => {
      this.setState({
        quizzes: quizzes,
      });
    });
  }

  searchChange(e) {
    this.setState({search: e.target.value});
  }

  showQuizzes() {
    this.setState({isQuizzes: true});
  }

  showQuestions() {
    this.setState({isQuizzes: false});
  }

  renderLectureQuiz(lectureItem, i) {
    var st = this.state;
    var pr = this.props;
    var quiz = lectureItem.quiz;
    return (
      <div className="lecturePanel">
        <div className="lecturePanelHeader">
          <div>{quiz.title}</div>
          <div
            className="mlauto lectureAddButton"
            onClick={pr.removeItemFromLecture.bind(this, i)}
          >
            &#8211;
          </div>
        </div>
        <div>
          {quiz.questions.map((question, questionIndex) => {
            return (
              <div
                key={questionIndex}
                className="lecturePanelItem"
              >
                {question.text}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderLectureQuestion(lectureItem, i) {
    var question = lectureItem.question;
    return (
      <div className="lectureQuestion" >
        <div className=" width100 borderRight pr10">
          {question.text}
        </div>
        <div className="mlauto">
          <div
            className="lectureAddButton ml10"
            onClick={this.props.removeItemFromLecture.bind(this, i)}
          >
            &#8211;
          </div>
        </div>
      </div>
    );
  }

  renderLectureItem(lectureItem, i) {
    switch (lectureItem.type) {
      case 'QUIZ':
        return this.renderLectureQuiz(lectureItem, i);
      case 'QUESTION':
        return this.renderLectureQuestion(lectureItem, i);
    }
  }

  renderLecture() {
    var st = this.state;
    var pr = this.props;
    return (
      <div>
        {pr.lecture.lectureItems.map((lectureItem, i) => {
          return (
            <div key={i}>
              {this.renderLectureItem(lectureItem, i)}
            </div>
          );
        })}
      </div>
    );
  }

  renderQuestions() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        {st.quizzes.map((quiz, quizIndex) => {
          return (
            <div className="lecturePanel" key={quizIndex}>
              <div className="lecturePanelHeader">
                <div>{quiz.title}</div>
                <div
                  className="mlauto lectureAddButton"
                  onClick={pr.addQuizToLecture.bind(this, quiz)}
                >
                  +
                </div>
              </div>
              <div>
                {quiz.questions.map((question, questionIndex) => {
                  return (
                    <div
                      key={questionIndex}
                      className="lecturePanelItem"
                    >
                      <div className=" width100 borderRight pr10">
                        {question.text}
                      </div>
                      <div className="mlauto">
                        <div
                          className="lectureAddButton ml10"
                          onClick={pr.addQuestionToLecture.bind(this, question)}
                        >
                          +
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderQuizzes() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        {st.quizzes.map((quiz, i) => {
          return (
            <div className="lecturePanel" key={i}>
              <div className="lecturePanelHeader">
                <div>{quiz.title}</div>
                <div
                  className="mlauto lectureAddButton"
                  onClick={pr.addQuizToLecture.bind(this, quiz)}
                >
                  +
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderQuizzesQuestions() {
    var st = this.state;
    return (
      <div className="quizzesQuestionsContainer">
        <div className="quizzesQuestionsHeader">
          <input
            className="normalInput mb10"
            value={st.search}
            onChange={this.searchChange.bind(this)}
            placeholder={`Search ${st.isQuizzes ? "quizzes" : "questions" }...`}
          />
          <div className="buttonGroup">
            <div
              className={`modalButton mr10 ${st.isQuizzes ? "" : "opacity50" }`}
              onClick={this.showQuizzes.bind(this)}
            >
              QUIZZES
            </div>
            <div
              className={`modalButton ${st.isQuizzes ? "opacity50" : ""}`}
              onClick={this.showQuestions.bind(this)}
            >
              QUESTIONS
            </div>
          </div>
        </div>
        <div className="quizzesQuestionsBody">
          {st.isQuizzes ?
            this.renderQuizzes()
            :
            this.renderQuestions()
          }
        </div>
      </div>
    );
  }

  renderCurrentLecture() {
    var st = this.state;
    var pr = this.props;
    return (
      <div>
        <input
          className="normalInput mb10"
          value={pr.lecture.title}
          onChange={pr.lectureChange.bind(this)}
          placeholder="Lecture title..."
        />
        <div
          className="modalButton mb10"
          onClick={pr.saveLecture.bind(this)}
        >
          SAVE
        </div>
        <div className="lectureBody">
          {this.renderLecture()}
        </div>
      </div>
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="lectureContainer">
        <p
          className="backButton"
          onClick={pr.showLectures.bind(this)}
        >
          &larr; Back
        </p>
        <div className="row">
          <div className="six columns pr20 borderRight">
            {this.renderQuizzesQuestions()}
          </div>
          <div className="six columns pl20">
            {this.renderCurrentLecture()}
          </div>
        </div>
      </div>
    )
  }
}
