import s from 'AnswerQuestion/AnswerQuestion.scss'
import Api from 'modules/Api.js'
import {browserHistory} from 'react-router'
import Utility from 'modules/Utility.js'


let counter = {};
export default class AnswerQuestion extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      question: {
        quiz: {
          title: ''
        }
      },
      timeRemaining: '',
      selectedAnswer: {},
      freeResponseAnswer: ''

    };
  }

  componentDidMount() {
    this.setQuestionKey(this.props.params.questionKey);
  }

  componentWillUnmount() {
    this.clearCounter();
  }

  componentWillReceiveProps(newProps) {
    this.setQuestionKey(newProps.params.questionKey);
  }

  setQuestionKey(questionKey) {
    var me = this;
    Api.db.post('question/getOpenQuestion', {questionKey: questionKey})
        .then(function(data){
          //var timeRemaining = Math.floor(data.timeRemaining);
          var expireDate = new Date(data.expireDate);
          var nowDate = new Date();
          // Convert both dates to milliseconds
          var date1_ms = nowDate.getTime();
          var date2_ms = expireDate.getTime();
          // Calculate the difference in seconds
          var timeRemaining = Math.floor((date2_ms - date1_ms)/1000);
          console.log("TIME REMAINING:", timeRemaining)
          var question = data.question;
          question.answers = me.resetSelectedAnswers(question.answers);
          me.setState({
            question: question,
            timeRemaining: timeRemaining
          });
          me.startTimer(timeRemaining);
        })
        .fail(function(){
          me.clearCounter();
          browserHistory.push('/s/quizzes');
        });
  }


  startTimer(timeRemaining) {
    var st = this.state;

    this.clearCounter();

    var me = this;
    counter = setInterval(timer, 1000); //1000 will run it every 1 second

    function timer() {
      timeRemaining--;
      if(timeRemaining <= 0) {
        browserHistory.push('/s/quizzes');
      }
      me.setState({timeRemaining: timeRemaining});
    }
  }

  clearCounter() {
      clearInterval(counter);
      counter = {};
  }

  componentWillUnmount() {
    this.clearCounter();
  }

  renderMultipleChoiceSection() {
    return this.state.question.answers.map((answer, answerIndex) => {
      return (
          <div className="row answerRow" key={answerIndex}>
            <div className="columns one pt10">{answer.option + ".)"}</div>
            <div className="columns eleven">
              <div
                  className={`answer ${answer.isSelected ? " selected" : ""}`}
                  onClick={() => this.handleSelectedAnswer(answerIndex)}
              >
                {answer.text}
              </div>
            </div>
          </div>
      );
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

  resetSelectedAnswers(answers) {
    answers.map(function(answer) {
      return answer.isSelected = false;
    });

    return answers;
  }

    handleFreeResponseChange() {
        const value = this.refs.freeResponseAnswer.value;
        this.setState({
            freeResponseAnswer: value
        });
    }

  renderFreeResponseSection() {
    var st = this.state;
    return (
        <div className="pl20 pr20">
        <textarea
            ref="freeResponseAnswer"
            className="freeResponse"
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

  submitAnswer() {
    var st = this.state;
    var pr = this.props;
    var refs = this.refs;
    var me = this;
    var answer = null;
    var text = null;

    switch(st.question.type) {
      case "multipleChoice":
        answer = st.selectedAnswer.id;
        break;
      case "freeResponse":
        text = refs.freeResponseAnswer.value;
        break;
    }

    Api.db.post('question/answer', {
      questionKey: pr.params.questionKey,
      answer: answer,
      text: text
    }).then(function(){
      me.setState({
        timeRemaining: ''
      });
      me.clearCounter();
      browserHistory.push('/s/quizzes');
    });

  }

  render() {
    var st = this.state;
    var pr = this.props;
    var me = this;
    return (
      <div className="answerQuestionContainer">
        <div>
          <img id="logo" src={Utility.LOGO_IMAGE_PATH} />
          <span id="timer">{st.timeRemaining}</span>
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


