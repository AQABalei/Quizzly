import s from 'Question/Question.scss'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'

export default class Question extends React.Component {
  static propTypes = {
    quizIndex: React.PropTypes.number.isRequired,
    questionIndex: React.PropTypes.number.isRequired,
    quiz: React.PropTypes.object.isRequired,
    question: React.PropTypes.object.isRequired,
    showQuestionInModal: React.PropTypes.func.isRequired,
    deleteQuestionFromQuiz: React.PropTypes.func.isRequired,
    askQuestion: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      successfullyAsked: false,
      hover: false,
      showSelectionSection: false,
      sections: []
    };
  }

  componentDidMount() {
  }

  askQuestion(quizIndex, questionIndex, sectionId) {

    // Show modal asking if user is usre
    var me = this;
    this.props.askQuestion(quizIndex, questionIndex, sectionId)
    .then((status) => {
      this.setState({showSelectionSection: false});
      this.setState({successfullyAsked: status}, () => {
        setTimeout(() => {this.setState({successfullyAsked: false});}, 2000);
      });
    });
  }

  selectSection() {
    console.log("selectSection");
    return Api.db.find('section', {course: this.props.quiz.course.id})
    .then((sections) => {
      console.log("sections", sections);
      this.setState({
        showSelectionSection: true,
        sections: sections
      });
    });
  }

  closeSectionsModal() {
    this.setState({showSelectionSection: false});
  }

  mouseEnter() {
    this.setState({hover: true});
  }

  mouseLeave() {
    this.setState({hover: false});
  }

  renderHover() {
    var pr = this.props;
    return (
      <div className="floatR">
        <span
          className="askButton"
          onClick={this.selectSection.bind(this)}
        >
          ASK
        </span>
        <span
          className="pointer deleteButton"
          onClick={pr.deleteQuestionFromQuiz.bind(this, pr.quizIndex, pr.questionIndex)}
        >
          DELETE
        </span>
      </div>
    );
  }

  /*renderSectionsInModal() {
    var st = this.state;
    var pr = this.props;
    return st.sections.map((section, sectionIndex) => {
      return (
        <div
          key={sectionIndex}
          className="selectSectionRow"
          onClick={this.askQuestion.bind(this, pr.quizIndex, pr.questionIndex, section.id)}
        >
          {section.alias && section.alias.length ? section.alias : section.title}
        </div>
      );
    })
  }*/
renderSectionsInModal() {
    var st = this.state;
    var pr = this.props;
    return st.sections.map((section, sectionIndex) => {
      return (
        <div
          key={sectionIndex}
          className="selectSectionRow"
          onClick={this.askQuestion.bind(this, pr.quizIndex, pr.questionIndex, section.id)}
        >
          {section.alias && section.alias.length ? section.alias : section.title}
        </div>
      );
    })
  }

  renderSelectionSection() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="quizSelect">
        <div className="quizSelectHeader">
          <div>Select Section</div>
          <span
            className="ml10 pointer"
            onClick={this.closeSectionsModal.bind(this)}
          >
            <img src={Utility.CLOSE_IMAGE_PATH} style={{"width":"12px"}}/>
          </span>
        </div>
        {this.renderSectionsInModal()}
      </div>
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="questionContainer">
        <div className="panelItem"
          onMouseEnter={this.mouseEnter.bind(this)}
          onMouseLeave={this.mouseLeave.bind(this)}
        >
          {st.successfullyAsked ?
            <div className="successMessage">ASKED</div>
            :
            null
          }
          <span
            className="pointer"
            onClick={this.props.showQuestionInModal.bind(this, pr.quizIndex, pr.questionIndex)}
          >
            {pr.question.text}
          </span>
          {st.hover ? this.renderHover() : null}
        </div>
        {st.showSelectionSection ? this.renderSelectionSection() : null}
      </div>
    )
  }
}
