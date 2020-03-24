
import s from 'elements/Panel/CoursePanel.scss'

export default class CoursePanel extends React.Component {
  static propTypes = {
    header: React.PropTypes.any.isRequired,
    footer: React.PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      rosterSelected : false,
      studentEmails: props.studentEmails,
      selectedSection: null
    }

    this.selectRoster = this.selectRoster.bind(this);
    this.selectQuiz = this.selectQuiz.bind(this);
  }

  componentDidMount() {
  }

  selectRoster() {
    this.state = {
      rosterSelected: true
    }
    this.forceUpdate()
  }

  selectQuiz() {
    this.state = {
      rosterSelected: false
    }
    this.forceUpdate();
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
       <div className="panelContainer">
        <div className="panelHeader">
          {pr.header} <br />
          <div className="courseOptions">
            <div className={st.rosterSelected ? 'quizzesButton' : 'hlButton' } onClick={this.selectQuiz}>
              Quizzes
            </div>
            <div className={st.rosterSelected ? 'hlButton' : 'rosterButton' } onClick={this.selectRoster}>
              Students
            </div>
          </div>
        </div>
        <div className="panelBody">
          <div className="panelFooterNew">
            { st.rosterSelected ? pr.rosterButton : pr.footer }
          </div>
          <div className="innerPanelBody">
            { st.rosterSelected ? pr.roster : pr.quizzes}
          </div>
        </div>
      </div>
    )
  }
}