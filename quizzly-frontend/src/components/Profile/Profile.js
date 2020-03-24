import s from 'Profile/Profile.scss'
import React from 'react'
import Input from 'elements/Input/Input.js'
import { browserHistory } from 'react-router'

export default class Profile extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.getUserFromSession();
  }

  getUserFromSession() {
    $.post('/session')
    .then((user) => {
      this.setState({user: user});
    })
    .fail(function() {
      browserHistory.push('/entrance');
    });
  }

  inputChange(input, value) {
    var user = this.state.user;
    user[input] = value;
    this.setState({user: user});
  }

  studentIdChange(value) {
    this.inputChange('studentId', value);
  }

  facultyIdChange(value) {
    this.inputChange('facultyId', value);
  }

  firstNameChange() {
    this.inputChange('firstName', value);
  }

  lastNameChange() {
    this.inputChange('lastName', value);
  }

  emailChange() {
    this.inputChange('email', value);
  }

  updateUser() {
    var user = this.state.user;
    var newUser = {email: user.email, firstName: user.firstName, lastName: user.lastName};
    var route = "/update/" + user.id;
    switch (user.type) {
      case 'STUDENT':
        newUser.studentId = user.studentId;
        route = '/student' + route;
        break;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        newUser.facultyId = user.facultyId;
        route = '/professor' + route;
        break;
    }

    Api.db.post(route, newUser)
    .then((user) => {
      console.log("updated user: ", user);
    });
  }

  renderDynamicInputs() {
    var st = this.state;
    switch (st.user.type) {
      case 'STUDENT':
        return <Input
            type="text"
            value={st.user.studentId}
            placeholder="ID"
            onChange={this.studentIdChange.bind(this)}
          />;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        return <Input
          type="text"
          value={st.user.facultyId}
          placeholder="ID"
          onChange={this.facultyIdChange.bind(this)}
        />;
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="profileContainer">
        <div className="quizzlyContent p20">
          <Input
            type="text"
            value={st.user.firstName}
            placeholder="First name"
            onChange={this.firstNameChange.bind(this)}
          />
          <Input
            type="text"
            value={st.user.lastName}
            placeholder="Last name"
            onChange={this.lastNameChange.bind(this)}
          />
          <Input
            type="text"
            value={st.user.email}
            placeholder="Email"
            onChange={this.emailChange.bind(this)}
          />
          {this.renderDynamicInputs()}
        </div>
      </div>
    )
  }
}
