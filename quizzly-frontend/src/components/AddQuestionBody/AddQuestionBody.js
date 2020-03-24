import s from 'AddQuestionBody/AddQuestionBody.scss'
import Input from 'elements/Input/Input.js'
import Api from 'modules/Api.js'

export default class AddQuestionBody extends React.Component {
  static propTypes = {
    quizIndex: React.PropTypes.number.isRequired,
    questionIndex: React.PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    var question = {
      type: "multipleChoice",
      duration: 30,
      text: "",
      answers: [
        {option: "A", text: "", correct: false},
        {option: "B", text: "", correct: false},
        {option: "C", text: "", correct: false}
      ]
    };

    this.state = {
      isFreeResponse: false,
      question: question,
      showHelperMessage: false
    };
  }

  componentDidMount() {
    var pr = this.props;
    var question = pr.quizzes[pr.quizIndex].questions[pr.questionIndex];
    console.log("isFreeResponse", this.state.isFreeResponse);
    if(question == undefined) {
      return;
    }

    Api.db.findOne('question', question.id)
    .then((question) => {
      console.log("AddQuestionBody::question", question);
      if(question.answers.length == 0) {
        question.answers = [
          {option: "A", text: "", correct: false},
          {option: "B", text: "", correct: false},
          {option: "C", text: "", correct: false}
        ];
      }
      this.setState({
        question: question,
        isFreeResponse: question.type == "freeResponse" ? true : false,
      });
    });
  }

  handleQuestionTitleChange(value) {
    var question = this.state.question;
    question.text = value;
    this.setState({question: question});
  }

  handleDurationChange() {
    const {timeLimit} = this.refs;
    const value = timeLimit.value;
    const question = this.state.question;
    question.duration = value;
    this.setState({question: question});
  }

  handleChange(i, event) {
    var value = event.target.value;
    var question = this.state.question;
    question.answers[i].text = value;

    this.setState({question: question});
  }

  addQuestion() {
    var answers = this.state.question.answers;
    answers.push(answer);
    this.setState({answers: answers});
  }

  showFreeResponse() {
    var question = this.state.question;
    question.type = "freeResponse";
    this.setState({
      isFreeResponse: true,
      question: question
    });
  }

  showMultipleChoice() {
    var question = this.state.question;
    question.type = "multipleChoice";
    this.setState({
      isFreeResponse: false,
      question: question
    });
  }

  setAsCorrectAnswer(answerIndex) {
    this.setState({showHelperMessage: false});
    var question = this.state.question;
    question.answers.map(function(answer) { return answer.correct = false });
    question.answers[answerIndex].correct = true;
    this.setState({question: question});
  }

  addQuestionToQuiz(question, quizIndex, questionIndex) {
    if(question.text.trim().length == 0) return;
    console.log("is free response", this.state.isFreeResponse);
    if(this.state.isFreeResponse) {
      this.props.addQuestionToQuiz(question, quizIndex, questionIndex);
    } else if(!this.correctAnswerIsSet(question)) {
      this.setState({showHelperMessage: true});
      return;
    } else {
      this.props.addQuestionToQuiz(question, quizIndex, questionIndex);
    }

  }

  correctAnswerIsSet(question) {
    var correctAnswerIsSet = false;
    question.answers.map(function(answer) {
      if(answer.correct) {
        correctAnswerIsSet = true;
      }
    });

    return correctAnswerIsSet;
  }

  renderAnswerToQuestion() {
    return (
      <div className="flex mb20 flexVertical">
        <Input
          type="text"
          placeholder="Question..."
          value={this.state.question.text}
          onChange={this.handleQuestionTitleChange.bind(this)}
        />
        <div className="nowrap mr10 ml10">Time Limit</div>
        <input
            ref="timeLimit"
            type="number"
            className="normalInput alignC"
            value={this.state.question.duration}
            min="1"
            onChange={this.handleDurationChange.bind(this)}
            style={{maxWidth: "50px"}}
        />
      </div>
    );
  }

  renderAnswers() {
    return this.state.question.answers.map((answer, answerIndex) => {
      return (
        <div key={answerIndex} className="flex mb20 flexVertical">
          <span
            className="mr15 greenButton"
            onClick={this.setAsCorrectAnswer.bind(this, answerIndex)}
          >
            {answer.option}.)
          </span>
          <input
            type="text"
            className={`normalInput ${answer.correct ? "lightGreenBackground" : ""}`}
            value={answer.text}
            placeholder="Option..."
            onChange={this.handleChange.bind(this, answerIndex)}
          />
        </div>
      );
    });
  }

  renderFooter() {
    if(this.state.isFreeResponse) {
      return null;
    }

    return <div
      className="footerButton"
      onClick={this.addQuestion.bind(this)}
    >
      +
    </div>;
  }

  render() {
    var st = this.state;
    var pr = this.props;

    return (
      <div className="addQuestionBodyContainer">
        <div className="row">
          <div className="six columns p20 pr10">
            <div
              className={`modalButton ${st.isFreeResponse ? "opacity40" : ""}`}
              onClick={this.showMultipleChoice.bind(this)}
            >
              MULTIPLE CHOICE
            </div>
          </div>
          <div className="six columns p20 pl10">
            <div
              className={`modalButton ${st.isFreeResponse ? "" : "opacity40"}`}
              onClick={this.showFreeResponse.bind(this)}
            >
              FREE RESPONSE
            </div>
          </div>
        </div>
        <div className="pl20 pr20">
          {this.renderAnswerToQuestion()}
          {this.state.isFreeResponse ? null : this.renderAnswers()}
        </div>
        {this.state.showHelperMessage && !st.isFreeResponse ?
          <div className="small alignC pb20 red">Please indicate a correct answer</div>
          :
          null
        }
        <div className="pb20 pl20 pr20">
          <div
            className="modalButton"
            onClick={this.addQuestionToQuiz.bind(this, st.question, pr.quizIndex, pr.questionIndex)}
          >
            SAVE QUESTION
          </div>
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
