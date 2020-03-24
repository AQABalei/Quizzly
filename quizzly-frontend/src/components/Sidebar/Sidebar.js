import s from 'Sidebar/Sidebar.scss'
import Utility from 'modules/Utility.js'
import {browserHistory} from 'react-router'

export default class Sidebar extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: window.location.pathname
    };
  }

  componentDidMount() {
  }

  setFilter(filter) {
    browserHistory.push(filter);
    this.setState({selected: filter});
  }

  isActive(value){
//    return 'sidebarElement ' + ((value === this.state.selected) ? 'greenBlueGradientLight' : '');

    return 'sidebarElement ' + ((value === this.state.selected) ? 'darkSelectedMenu' : '');
  }
              // <div className={this.isActive('/p/lectures')} onClick={this.setFilter.bind(this, '/p/lectures')}>Lectures</div>

  renderUserContent() {
    switch(this.props.user.type) {
      case 'STUDENT':
        return (
          <span>
            <div className={this.isActive('/s/quizzes')} onClick={this.setFilter.bind(this, '/s/quizzes')}>Quizzes</div>
            {/*<div className={this.isActive('/s/metrics')} onClick={this.setFilter.bind(this, '/s/metrics')}>Metrics</div>*/}
          </span>
        );
        break;
      case 'ADMINISTRATOR':
        return (
          <span>
            <div className="sidebarTitle">MAIN</div>
            <div className={this.isActive('/p/courses')} onClick={this.setFilter.bind(this, '/p/courses')}>
              <img className="smallIcon" src={Utility.NOTEBOOK_IMAGE_PATH}/>Courses
              </div>
            <div className={this.isActive('/p/quizzes')} onClick={this.setFilter.bind(this, '/p/quizzes')}>
                <img className="smallIcon" src={Utility.QUIZ_IMAGE_PATH}/>Quizzes
            </div>
            <div className={this.isActive('/p/metrics')} onClick={this.setFilter.bind(this, '/p/metrics')}>
              <img className="smallIcon" src={Utility.METRICS_IMAGE_PATH}/>Metrics
            </div>
            <div className={this.isActive('/p/export')} onClick={this.setFilter.bind(this, '/p/export')}>
              <img className="smallIcon" src={Utility.COURSES_PAGE_PATH}/>Export
            </div>
            <div className={this.isActive('/a/admin')} onClick={this.setFilter.bind(this, '/a/admin')}>
              <img className="smallIcon" src={Utility.LOGO_IMAGE_PATH}/>Admin
            </div>
            {/*<div className={this.isActive('/p/download')} onClick={this.setFilter.bind(this, '/p/download')}>Download Grades</div>*/}
          </span>
        );
        break;
      case 'PROFESSOR':
        return (
          <span>
            <div className="sidebarTitle">MAIN</div>
            <div className={this.isActive('/p/courses')} onClick={this.setFilter.bind(this, '/p/courses')}>
              <img className="smallIcon" src={Utility.NOTEBOOK_IMAGE_PATH}/>Courses
              </div>
            <div className={this.isActive('/p/quizzes')} onClick={this.setFilter.bind(this, '/p/quizzes')}>
                <img className="smallIcon" src={Utility.QUIZ_IMAGE_PATH}/>Quizzes
            </div>
            <div className={this.isActive('/p/metrics')} onClick={this.setFilter.bind(this, '/p/metrics')}>
              <img className="smallIcon" src={Utility.METRICS_IMAGE_PATH}/>Metrics
            </div>
            <div className={this.isActive('/p/export')} onClick={this.setFilter.bind(this, '/p/export')}>
              <img className="smallIcon" src={Utility.COURSES_PAGE_PATH}/>Export
            </div>
            {/*<div className={this.isActive('/p/download')} onClick={this.setFilter.bind(this, '/p/download')}>Download Grades</div>*/}
          </span>
        );
        break;
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="sidebarContainer">
        <div className="sideBarTop">
          <img className="logo" src={Utility.LOGO_IMAGE_PATH} />
          <h1 className="quizzlyLogo">QUIZZLY</h1>
        </div>
        {this.renderUserContent()}
      </div>
    )
  }
}
