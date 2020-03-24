import s from 'AnswerQuiz/AnswerQuiz.scss'
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
      questions: [{
        quiz: {},
        title: ''
       }
      ],
      quizTitle: '',
      quizId: '',
      currentIndex: 0,
      timeRemaining: '',
      freeResponseAnswer: '',
      selectedAnswer: {},

    };
  }

  componentDidMount() {
    this.setQuizKey(this.props.params.quizKey);
  }

  componentWillUnmount() {
    this.clearCounter();
  }

  componentWillReceiveProps(newProps) {
    this.setQuizKey(newProps.params.quizKey);
  }

  setQuizKey(quizKey) {
    var me = this;
    const currentIndex = this.state.currentIndex;
    Api.db.post('quiz/getOpenQuiz', {quizKey: quizKey})
        .then(function(data){
          const questions = data.quiz.questions;
          const quizId = data.quiz.id;
          const quizTitle = data.quiz.title;
          const timeRemaining = questions[currentIndex].duration;
          // const endTime = questions[currentIndex].endTime;
          me.setState({
            questions: questions,
            quizId: quizId,
            quizTitle: quizTitle,
            timeRemaining: timeRemaining
          });
          me.startTimer(timeRemaining);
          // me._startTimer(endTime)
        })
        .fail(function(){
          browserHistory.push('/s/quizzes');
        });
  }
  _startTimer(endTime) {
    var st = this.state;
    this.clearCounter();
    var me = this;
    const { currentIndex, questions } = this.state;
    const nextIndex = currentIndex+1

    // compute timeRemaining
    var endTimeDate = new Date(endTime)
    var nowDate = new Date()
    // time remaining in seconds
    var timeRemaining = diffSeconds(nowDate, endTimeDate)

    counter = setInterval(timer, 1000); //1000 will run it every 1 second

    function timer() {
      timeRemaining--;
      if(timeRemaining <= 0) {
        if(nextIndex < questions.length) {
          me.setState({
            currentIndex: nextIndex
          });
          me.startTimer(questions[nextIndex].duration);
          // me.startTimer(questions[nextIndex].endTime)
        } else {
          browserHistory.push('/s/quizzes');
        }
      }
      me.setState({timeRemaining: timeRemaining});
    }

  }
  diffSeconds( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    // Convert back to seconds and return
    return Math.round(difference_ms/1000); 
  }

  startTimer(timeRemaining) {
    var st = this.state;

    this.clearCounter();

    var me = this;
    const { currentIndex, questions } = this.state;
    const nextIndex = currentIndex+1;

    counter = setInterval(timer, 1000); //1000 will run it every 1 second

    function timer() {
      timeRemaining--;
      if(timeRemaining <= 0) {
        if(nextIndex < questions.length) {
          me.setState({
            currentIndex: nextIndex
          });
          me.startTimer(questions[nextIndex].duration);
          // me.startTimer(questions[nextIndex].endTime)
        } else {
          browserHistory.push('/s/quizzes');
        }
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
    const {questions, currentIndex} = this.state;
    const question = questions[currentIndex];
    return question.answers.map((answer, answerIndex) => {
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

  handleSelectedAnswer(answerIndex) {
    const {questions, currentIndex} = this.state;
    const question = questions[currentIndex];
    question.answers = this.resetSelectedAnswers(question.answers);
    question.answers[answerIndex].isSelected = true;
    this.setState({
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
    const { questions, currentIndex} = this.state;
    const question = questions[currentIndex];
    switch(question.type) {
      case "multipleChoice":
        return this.renderMultipleChoiceSection();
      case "freeResponse":
        return this.renderFreeResponseSection();
    }
  }

  submitAnswer() {
    const {freeResponseAnswer} = this.refs;
    const {quizKey} = this.props.params;
    const {questions, currentIndex, selectedAnswer} = this.state;
    const question = questions[currentIndex];
    const nextIndex = currentIndex+1;
    const me = this;
    var answer = null;
    var text = null;


    switch(question.type) {
      case "multipleChoice":
        answer = selectedAnswer.id;
        break;
      case "freeResponse":
        text = freeResponseAnswer.value;
        break;
    }

    Api.db.post('quiz/answer', {
      quizKey: quizKey,
      answer: answer,
      question: question.id,
      text: text
    }).then(function(){
      if(nextIndex < questions.length) {
        me.setState({
          currentIndex: nextIndex
        });
        const timeRemaining  = questions[nextIndex].duration;
        me.startTimer(timeRemaining);
      } else {
        browserHistory.push('/s/quizzes');
      }
    });

  }

  renderQuestion() {
    const {questions, currentIndex, quizTitle} = this.state;
    const question = questions[currentIndex];

    return (
        <div id="studentQuestion">
          <div className="quizTitle">{(quizTitle+ "").toUpperCase()}</div>
          <div className="question">{question.text}</div>
          <div className="questionBorder"></div>
          {this.renderAnswerSection()}
          <div
              className="submit"
              onClick={this.submitAnswer.bind(this)}
          >
            SUBMIT
          </div>
        </div>
    )
  }

  render() {
    var st = this.state;
    return (
      <div className="answerQuestionContainer">
        <div>
          <img id="logo" src={Utility.LOGO_IMAGE_PATH} />
          <span id="timer">{st.timeRemaining}</span>
        </div>
        {this.renderQuestion()}
      </div>
    )
  }
}
