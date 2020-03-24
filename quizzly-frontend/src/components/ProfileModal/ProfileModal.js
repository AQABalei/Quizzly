import s from 'ProfileModal/ProfileModal.scss'
import Modal from 'elements/Modal/Modal.js'
import Input from 'elements/Input/Input.js'
import Utility from 'modules/Utility.js'
import Api from 'modules/Api.js'

export default class ProfileModal extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    updateUser: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };
  }

  componentDidMount() {
  }

  handleChange(input, value) {
    var user = this.state.user;
    user[input] = value;
    this.setState({user: user});
  }

  emailChange(value) {
    this.handleChange('email', value);
  }

  firstNameChange(value) {
    this.handleChange('firstName', value);
  }

  lastNameChange(value) {
    this.handleChange('lastName', value);
  }

  studentIdChange(value) {
    this.handleChange('studentId', value);
  }

  facultyIdChange(value) {
    this.handleChange('facultyId', value);
  }

  updateUser() {
    var user = this.state.user;
    var pr = this.props;
    var newUser = {email: user.email, firstName: user.firstName, lastName: user.lastName};
    var route = "/update/" + user.id;
    switch (user.type) {
      case 'STUDENT':
        newUser.studentId = user.studentId;
        route = 'student' + route;
        break;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        newUser.facultyId = user.facultyId;
        route = 'professor' + route;
        break;
    }

    Api.db.post(route, newUser)
    .then((user) => {
      console.log("updated user: ", user);
      this.setState({user: user});
      pr.updateUser(user);
      pr.closeModal();
    });
  }

  renderUserIdInput() {
    var st = this.state;
    switch (st.user.type) {
      case 'STUDENT':
        return <Input
          type="text"
          className="mb20"
          value={st.user.studentId}
          placeholder="ID"
          onChange={this.studentIdChange.bind(this)}
        />;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        return <Input
          type="text"
          className="mb20"
          value={st.user.facultyId}
          placeholder="ID"
          onChange={this.facultyIdChange.bind(this)}
        />;
    }
  }

  renderBody() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="profileModalBody">
        <Input
          type="text"
          className="mb20"
          value={st.user.firstName}
          placeholder="First name"
          onChange={this.firstNameChange.bind(this)}
        />
        <Input
          type="text"
          className="mb20"
          value={st.user.lastName}
          placeholder="Last name"
          onChange={this.lastNameChange.bind(this)}
        />
        <Input
          type="text"
          className="mb20"
          value={st.user.email}
          placeholder="Email"
          onChange={this.emailChange.bind(this)}
        />
        {this.renderUserIdInput()}
        <button className="centerBlock round" onClick={this.updateUser.bind(this)}>UPDATE INFO</button>
      </div>
    );

  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="profileModalContainer">
        <Modal
          title="Profile Information"
          body={this.renderBody()}
          closeModal={pr.closeModal.bind(this)}
        />
      </div>
    )
  }
}
