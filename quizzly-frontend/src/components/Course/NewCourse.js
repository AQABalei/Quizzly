import s from 'Course/Course.scss'
import Api from 'modules/Api.js'
import Panel from 'elements/Panel/Panel.js'
import CoursePanel from 'elements/Panel/CoursePanel.js'
import Utility from 'modules/Utility.js'

export default class NewCourse extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    showEditCourseModal: React.PropTypes.func,
    showEditSectionModal: React.PropTypes.func,
    showStudentsModal: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      quizSelected: true,
      secIndexSelected: null,
      sectionSelected: null
    };
  }

  componentWillMount() {
    /*Api.db.findOne('section', this.props.section.id)
    .then((section) => {
      var studentEmails = "";
      section.students.map((student) => {
        studentEmails += student.email + "\n";
      });
      this.setState({studentEmails: studentEmails});
    });
    */
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

          <img className="courses-logo" src={Utility.COURSES_PAGE_PATH} />
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
          className="deleteButton pointer"
          onClick={pr.isCourse ?
            pr.deleteCourseFromProfessor.bind(this, pr.course)
            :
            pr.deleteSectionFromCourse.bind(this, pr.sectionIndex)}
          >

          </div>
      </div>
    );
  }

  renderPanelQuizzes() {
    var st = this.state;
    var pr = this.props;
    return (
      pr.course.quizzes.map((quiz, quizIndex) => {
        return (
          <div key={quizIndex} title={quiz} className="panelItem" /*onClick={this.props.showMetricModal.bind(this, quiz)}*/>
            <span className="pointer" onClick={pr.showQuizInModal.bind(this, quizIndex)}>
              {quizIndex + 1}. {quiz.title}
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

  renderPanelRoster() {
    var st = this.state;
    var pr = this.props;
    if (pr.sections !== undefined) {
      return (
        pr.sections.map((section, secIndex) => {
          return (
            <div>
            <div className={this.state.sectionSelected == section ? "grayBG panelItemTitle pointer" : "panelItemTitle pointer"} onClick={()=>{this.setState({sectionSelected: section})}}>
              {section.title}
            </div>
            {section.students !== undefined ? section.students.map((student, stuIndex) => {
              return (
                <div className="panelItem">
                  <span className="pointer">
                    &nbsp; &nbsp; {student.email}
                  </span>
                </div>
                )
            }) : '' }
            </div>
          )
      }))
    } else {
      return (
        <div />
        )
    }
  }

  renderRosterFooter(quizSelected) {
    var pr = this.props;
    if(pr.isCourse) {
      if (this.state.sectionSelected != null) {
        return (
          <div>
            <div className="panelFooterButton"
                onClick={
                  pr.showStudentsModal.bind(
                  this,
                  this.state.sectionSelected)
                }>
                MANAGE STUDENTS
            </div>
            <span className="helpText">
              Make sure a section is selected
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <div className="panelFooterButton">
              MANAGE STUDENTS
            </div>
            <span className="helpText">
              Make sure a section is selected
            </span>
          </div>
        );
      }
    }

    return <div
      className="panelFooterButton"
      style={{fontWeight: "300 !important"}}
      onClick={pr.showStudentsModal.bind(this, pr.section)}
    >
      Update Students
    </div>;
  }

  renderPanelFooter(quizSelected) {
    var pr = this.props;
    console.log("panelFooter->")
    if(pr.isCourse) {
      return <div className="panelFooterButton" onClick={pr.showQuizModal.bind(this)}>
        CREATE NEW QUIZ
      </div>;
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
        <CoursePanel
          studentEmails={this.state.studentEmails}
          header={this.renderPanelHeader()}
          roster={this.renderPanelRoster()}
          quizzes={this.renderPanelQuizzes()}
          footer={this.renderPanelFooter()}
          rosterButton={this.renderRosterFooter()}
        />
      </span>
    )
  }
}
