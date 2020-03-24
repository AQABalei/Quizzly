import s from 'Admin/Admin.scss'
import DonutComponent from 'DonutComponent/DonutComponent.js'
import ConfirmProfessorPanel from 'Admin/ConfirmProfessorPanel.js'
import Api from 'modules/Api.js'
import Panel from 'elements/Panel/Panel.js'

export default class Admin extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      professors: [],
      professor: {
        email: '',
      }
    };
  }

  componentDidMount() {
    /* Get list of all users */
    this.getPendingProfessors();
  }

  componentWillReceiveProps(newProps) {
  }

  getAllUsers() {
    // Api call to get all student users of app. Put all students into an array and render() can update based on the array
  }

  _handleKeyPress(val) {
    // Api call to server to make pending user a professor
    this.refs.emailVal.value = ""
    Api.db.post('admin/makeprofessor', {email: val}).then(function(data){
      console.log(data)
    });
  }

  getPendingProfessors() {
    // Api call to server to get pending professors
    Api.db.post('admin/getpending', {}).then(function(data){
      this.setState({professors: data});
      console.log(data)
    }.bind(this))
  }

  renderPendingProfessorPanels() {
    if (this.state.professors.length === 0) {
      return (
        <div>
          No Pending Professors
        </div>
      )
    }
    return this.state.professors.map((professor, i) => {
      return (
        <ConfirmProfessorPanel
          key={i}
          professorEmail={professor.email}
        />
      );
    })
  }

  render() {
    return (
      <div className="quizzlyContent">
        <div className="innerPanelProfessorConfirm">
          {this.renderPendingProfessorPanels()}
        </div>
      </div>
    )
  }
}
