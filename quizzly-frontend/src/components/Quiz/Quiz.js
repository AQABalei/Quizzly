import s from 'Quiz/Quiz.scss'
import Question from 'Question/Question.js'
import Panel from 'elements/Panel/Panel.js'
import Utility from 'modules/Utility.js'

export default class Quiz extends React.Component {
  static propTypes = {
    quiz: React.PropTypes.object.isRequired,
    quizIndex: React.PropTypes.number.isRequired,
    duplicateQuizOnCourse: React.PropTypes.func.isRequired,
    deleteQuizFromCourse: React.PropTypes.func.isRequired,
    deleteQuestionFromQuiz: React.PropTypes.func.isRequired,
    showQuestionModal: React.PropTypes.func.isRequired,
    showQuestionInModal: React.PropTypes.func.isRequired,
    showQuizModal: React.PropTypes.func.isRequired,
    askQuestion: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      title: "Quiz Title",
      showModal: false,
      showQuestions: false
    };
  }

  componentDidMount() {
  }

  renderPanelHeader() {
    var pr = this.props;
    var header = [];
    return (
      <div onClick={::this.toggleBody} className="pointer">
         <span
          className="pointer smallHeader expandLink"
          onClick={::this.toggleBody}
          >
        <img src={Utility.EXPAND_IMAGE_PATH} style={{"width":"23px"}} />
        </span>
        <span
          key={0}
          className="pointer smallHeader"
          onClick={pr.showQuizModal.bind(this, pr.quizIndex, "Edit Quiz")}
        >
          {pr.quiz.title}
        </span>
        <span
          key={1}
          className="duplicate pointer"
          onClick={pr.duplicateQuizOnCourse.bind(this, pr.quizIndex)}
        >
          Duplicate
        </span>
        <span key={2}
          className="floatR pointer"
          onClick={pr.deleteQuizFromCourse.bind(this, pr.quizIndex)}
        >
        <img src={Utility.CLOSE_IMAGE_PATH} style={{"width":"12px"}} />
        </span>
      </div>
    )

  }

  toggleBody() {
    let n = !this.state.showQuestions
    this.setState({
      showQuestions: n
    })
  }

  renderPanelBody() {
    var pr = this.props;
    // Renders all questions
    if (this.state.showQuestions === true) {
      return(
        <div className="marginBottom">

       <div
        className="addQuizButton"
        onClick={pr.showQuestionModal.bind(this, pr.quizIndex, -1)}
        >
          ADD QUESTION
        </div>
        <div className="innerPanelBodyQuiz">
          {pr.quiz.questions.map((question, questionIndex) => {
          return (
            <Question
              key={questionIndex}
              quizIndex={pr.quizIndex}
              questionIndex={questionIndex}
              quiz={pr.quiz}
              question={question}
              showQuestionInModal={pr.showQuestionInModal.bind(this)}
              deleteQuestionFromQuiz={pr.deleteQuestionFromQuiz.bind(this)}
              askQuestion={pr.askQuestion.bind(this)}
            />
          );
        })}
        </div>
        </div>)
    } else {
      return (<div/>);
    }
  }

  renderPanelFooter() {
    var pr = this.props;
    return <div/>
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <Panel
        header={this.renderPanelHeader()}
        body={this.renderPanelBody()}
        footer={this.renderPanelFooter()}
      />
    )
  }
}
