import s from 'Question/Question.scss'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'

export default class ConfirmProfessorPanel extends React.Component {
  static propTypes = {
    professorEmail: React.PropTypes.string.isRequired,
    // denyProfessor: React.PropTypes.func.isRequired,
    // confirmProfessor: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      professorEmail: props.professorEmail,
      confirmed: false,
      denied: false,
    };
  }

  componentDidMount() {
  }

  confirmEmail() {

    this.setState({
      confirmed: true,
      denied: false
    })
    // Show modal asking if user is usre
    Api.db.post('admin/makeprofessor', {email: this.state.professorEmail})
    .then(function(data){
    }).bind(this);

  }

  denyEmail() {

    this.setState({
      denied: true,
      confirmed: false
    })
    // Show modal asking if user is usre
    Api.db.post('admin/denyprofessor', {email: this.state.professorEmail})
    .then(function(data){
    }).bind(this);
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

  render() {
    var st = this.state;
    var pr = this.props;

    if (this.state.confirmed && !this.state.denied) {
      return (
        <div className="professorContainer confirmedItem">
          <div className="panelItem">
            <span>
              {st.professorEmail}
            </span>
          </div>
        </div>
      )
    }
    else if (this.state.denied && !this.state.confirmed) {

      return (
        <div className="professorContainer deniedItem">
          <div className="panelItem">
            <span>
              {st.professorEmail}
            </span>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="professorContainer">
          <div className="panelItem">
            <span>
              {st.professorEmail}
            </span>
            <div className="floatR">
              <span className="confirmButton" onClick={this.confirmEmail.bind(this)} >
                Confirm
              </span>
              <span className="pointer denyButton" onClick={this.denyEmail.bind(this)}>
                Deny
              </span>
            </div>
          </div>
        </div>
      )
    }
  }
}
