import s from 'StudentQuestionModal/StudentQuestionModal.scss'
import Modal from 'elements/Modal/Modal.js'
import Input from 'elements/Input/Input.js'
import Api from 'modules/Api.js'
import Session from 'modules/Session.js'

export default class StudentQuestionModal extends React.Component {
  static propTypes = {
    question: React.PropTypes.object.isRequired,
    closeModal: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      studentAnswer: {}
    };
  }

  componentDidMount() {
    Api.db.find('studentanswer', {question: this.props.question.id, student: Session.user.id})
    .then((studentAnswer) => {
      this.setState({studentAnswer: studentAnswer[0]});
    });
  }

  chooseAnswerStatus(answer) {
    if(answer.correct) {
      return "correctAnswer";
    }
    if(answer.studentSelectedIncorrect) {
      return "wrongAnswer";
    }
  }

  renderAnswerBody() {
    var question = this.props.question;
    var studentAnswer = this.state.studentAnswer;
    switch(question.type) {
      case "multipleChoice":
        return question.answers.map((answer, answerIndex) => {
              return (
                  <div className="flex mb20 flexVertical" key={answerIndex}>
                    <span className="mr15">{answer.option}.)</span>
                    <Input
                        type="text"
                        className={`addCourseInput ${this.chooseAnswerStatus(answer)}`}
                        value={answer.text}
                        placeholder="Option..."
                        disabled
                    />
                  </div>
              );
            });
        break;
      case "freeResponse":
        return (
            <p><b>Answer:</b> {question.answerText}</p>
        );
        break;
    }
  }

  renderModalBody() {
    return (
      <div id="addQuestionBody">
        <div className="p20">
          <div className="flex mb20 flexVertical">
            <Input
              type="text"
              className="addCourseInput"
              placeholder="Question..."
              value={this.props.question.text}
              disabled
            />
          </div>
          <div>{this.props.question.studentUnanswered ? "Unanswered" : ""}</div>
          {this.renderAnswerBody()}
        </div>
      </div>
    );
  }

  renderModalTitle() {
    var question = this.props.question;
    switch(question.type) {
      case "multipleChoice":
        return `Multiple Choice Question From Quiz: ${question.quiz.title}`;
      case "freeResponse":
        return `Free Response Question From Quiz: ${question.quiz.title}`;
      default:
        return "Question type unknown";
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="studentQuestionModalContainer">
        <Modal
          title={this.renderModalTitle()}
          body={this.renderModalBody()}
          closeModal={pr.closeModal.bind(this)}
        />
      </div>
    )
  }
}
