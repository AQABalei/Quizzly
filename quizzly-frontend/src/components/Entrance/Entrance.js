import s from 'Entrance/Entrance.scss'
import {browserHistory} from 'react-router'
import Input from 'elements/Input/Input.js'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'
import StringValidator from 'modules/StringValidator.js'

export default class Entrance extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isSignIn: true,
      isProfessor: false,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      status: "initial"
    };
  }

  componentDidMount() {
  }

  handleInputChange(input, value) {
    var state = this.state;
    state[input] = value;
    this.setState(state);
  }

  handleEmailChange(value) {
    this.handleInputChange('email', value);
  }

  handlePasswordChange(value) {
    this.handleInputChange('password', value);
  }

  handleFirstNameChange(value) {
    this.handleInputChange('firstName', value);
  }

  handleLastNameChange(value) {
    this.handleInputChange('lastName', value);
  }

  handleEntranceSubmit() {
    console.log("SERVER: " + Api.baseUrl);

    this.setState({status: "pending"});
    var st = this.state;
    var firstName = "", lastName = "";
    var email = st.email.trim();
    var password = st.password.trim();
    if (!password || !email) {
      this.setState({status: "initial"});
      return;
    }

    if(st.isSignIn) {
      Api.db.post('login', {email: email, password: password})
      .then((user) => {
        return Api.db.post('session', user);
      })
      .then((user) => {
        console.log("User is logged in", user);
        var route = 'p';
        switch(user.type) {
          case 'ADMINISTRATOR':
          case 'PROFESSOR':
            route = '/p/courses';
            break;
          case 'STUDENT':
            route = '/s/quizzes';
            break;
          case 'PROFESSOR_PENDING':
            route = '/pending';
            break;
        }
        browserHistory.push(route);
      })
      .fail((err) => {
        alert("Sign in failed!");
        this.setState({status: "initial"});
        console.log(err);
      });
    } else {
      var firstName = st.firstName.trim();
      var lastName = st.lastName.trim();
      var isProfessor = st.isProfessor;

      if (!firstName || !lastName) {
        this.setState({status: "initial"});
        return;
      }
      if(!StringValidator.isEmail(email)){
        this.setState({status: "initial"});
        alert("Please enter a valid email address.")
        return;
      }
      Api.db.post('signup', {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isProfessor: isProfessor
      })
      .then((user) => {
        return Api.server.post('session', user);
      })
      .then((user) => {
        console.log("User is logged in", user);
        var route = 'p';
        if(isProfessor) {
          route = '/pending';
        } else {
          route = '/s/quizzes';
        }
        browserHistory.push(route);
      }) // display bad email/password
      .fail((err) => {
        alert("Sign up failed! This email already exists. Pleast try again");
        this.setState({status: "initial"});
        console.log(err);
      });
    }
  }

  swapEntryType() {
    var isSignIn = this.state.isSignIn;
    this.setState({isSignIn: !isSignIn});
  }

  updateIsProfessor(e) {
    var isProfessor = e.target.checked;
    console.log("isProfessor", isProfessor);
    this.setState({isProfessor: isProfessor});
  }

  chooseSignButtonText() {
    const {
      isSignIn,
      status
    } = this.state;

    if(isSignIn) {
      if(status == "pending") {
        return "SIGNING IN...";
      } else {
        return "SIGN IN";
      }
    } else {
      if(status == "pending") {
        return "SIGNING UP...";
      } else {
        return "SIGN UP";
      }
    }
  }

  renderSignUpInputs() {
    var st = this.state;
    return (
      <div>
        <Input
          inputClass="entranceInput"
          className="mb30"
          type="text"
          placeholder="First name"
          value={st.firstName}
          onEnter={this.handleEntranceSubmit.bind(this)}
          onChange={this.handleFirstNameChange.bind(this)}
        />
        <Input
          inputClass="entranceInput"
          className="mb30"
          type="text"
          placeholder="Last name"
          value={st.lastName}
          onEnter={function(){}}
          onChange={this.handleLastNameChange.bind(this)}
        />
      </div>
    );
  }

  renderSignInInputs() {
    var inputArray = [];
    inputArray.push(
      <Input
        key={0}
        inputClass="entranceInput"
        className="mb20"
        type="text"
        placeholder="Email"
        value={this.state.email}
        onEnter={function(){}}
        onChange={this.handleEmailChange.bind(this)}
      />
    );

    inputArray.push(
      <Input
        key={1}
        inputClass="entranceInput"
        className="entranceInput mb30"
        type="password"
        placeholder="Password"
        value={this.state.password}
        onEnter={this.handleEntranceSubmit.bind(this)}
        onChange={this.handlePasswordChange.bind(this)}
      />
    );

    return inputArray;
  }

  renderUserCheckBox() {
    return (
      <div className="mb20">
        <input
          type="checkbox"
          className="mr10"
          onEnter={this.handleEntranceSubmit.bind(this)}
          onChange={this.updateIsProfessor.bind(this)}
          checked={this.state.isProfessor}
        />
        <span className="p white">I'm a Professor</span>
      </div>
    );
  }
  render() {
    var st = this.state;
    var pr = this.props;
    var isSignUpNewUser = !this.state.isSignIn;
    return (
      <div className="entranceContainer">
        <div className="innerEntranceContainer">
          <div className="title mb10">QUIZZLY</div>
          <div className="subtitle mb20">The scholastic environment where clickers don't exist</div>
          <div className="forms">
          <img className="logo mb20" src={Utility.LOGO_IMAGE_PATH} />
          <div className="loginForm">
            {isSignUpNewUser ? this.renderSignUpInputs() : null}
            {this.renderSignInInputs()}
            {isSignUpNewUser ? this.renderUserCheckBox() : null}
            <button
              className="signButton"
              disabled={st.status == "pending" ? true : false}
              onClick={this.handleEntranceSubmit.bind(this)}
            >
              {this.chooseSignButtonText()}
            </button>
          </div>
          <div className="subsubtitle">Or switch to&nbsp;
            <a className="bold pointer" onClick={this.swapEntryType.bind(this)}>{isSignUpNewUser ? "sign in" : "sign up" }</a>
            {/*&nbsp;or&nbsp;*/}
            {/*<a href="#" className="bold">sign in with Blackboard</a>*/}
          </div>
          <a
            className="footer pointer"
            onClick={() => browserHistory.push('/download')}
          >
            Download
          </a>
        </div>
        </div>
      </div>
    )
  }
}
