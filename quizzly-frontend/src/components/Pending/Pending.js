import s from 'Pending/Pending.scss'
import Api from 'modules/Api.js'

export default class Admin extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    /* Get list of all users */
  }

  componentWillReceiveProps(newProps) {
  }
  
  getAllUsers() {
    // Api call to get all student users of app. Put all students into an array and render() can update based on the array
  }

  _handleKeyPress(val) {
  }


  render() {
    return (
      <div className="body-box">
      <div className="title">QUIZZLY</div>
        Sorry! Your account is still pending approval for professor privileges. Please contact an administrator with your account email
        to expedite this process. 
      </div>
    )
  }
}