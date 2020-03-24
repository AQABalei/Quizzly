import s from 'Course/Course.scss'

import Panel from 'elements/Panel/Panel.js'
import Utility from 'modules/Utility.js'

export default class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    showEditCourseModal: React.PropTypes.func,
    showEditSectionModal: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // console.log("Course: componentDidMount", this.props.course);
  }

  renderPanelHeaderTitle() {
    var pr = this.props;
    if(pr.isCourse) {
      return pr.course.title;
    }

    if(pr.section.alias && pr.section.alias.length) {
      return pr.section.alias;
    }

    return pr.section.title;
  }

  renderPanelHeader() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="coursePanelHeader">
        <div
          className="pointer"
          onClick={pr.isCourse ?
            pr.showEditCourseModal.bind(this, pr.course)
            :
            pr.showEditSectionModal.bind(this, pr.section, pr.sectionIndex)
          }
        >
          {this.renderPanelHeaderTitle()}
        </div>
        <div
          className="mlauto"
          onClick={pr.isCourse ?
            pr.deleteCourseFromProfessor.bind(this, pr.course)
            :
            pr.deleteSectionFromCourse.bind(this, pr.sectionIndex)}
          >
            <img src={Utility.CLOSE_IMAGE_PATH} style={{"width":"12px"}}/>
          </div>
      </div>
    );
  }

  renderPanelBody() {
    var st = this.state;
    var pr = this.props;
    return (
      pr.course.quizzes.map((quiz, quizIndex) => {
        return (
          <div key={quizIndex} title={quiz} className="panelItem" /*onClick={this.props.showMetricModal.bind(this, quiz)}*/>
            <span className="pointer" onClick={pr.showQuizInModal.bind(this, quizIndex)}>
              {quiz.title}
            </span>
            {pr.isCourse ?
              <span className="floatR pointer opacity40" onClick={pr.deleteQuizFromCourse.bind(this, quizIndex)}>
                <img src={Utility.CLOSE_IMAGE_PATH} style={{width:"8px"}} />
              </span>
              :
              null
            }
          </div>
        );
      })
    );
  }

  renderPanelFooterQuiz() {
    var pr = this.props;
    if(pr.isCourse) {
      return <div className="panelFooterButton" onClick={pr.showQuizModal.bind(this)}>Add Quiz</div>;
    }

    return <div
      className="panelFooterButton"
      style={{fontWeight: "300 !important"}}
      onClick={pr.showStudentsModal.bind(this, pr.section)}
    >
      Update Students
    </div>;
  }

  renderPanelFooterStudent() {
    var pr = this.props;
    if(pr.isCourse) {
      return <div className="panelFooterButton" onClick={pr.showStudentsModal.bind(this)}>Add Students</div>;
    }

    return <div
      className="panelFooterButton"
      style={{fontWeight: "300 !important"}}
      onClick={pr.showStudentsModal.bind(this, pr.section)}
    >
      Update Students
    </div>;
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <span className="courseContainer">
        <Panel
          header={this.renderPanelHeader()}
          body={this.renderPanelBody()}
        />
      </span>
    )
  }
}
