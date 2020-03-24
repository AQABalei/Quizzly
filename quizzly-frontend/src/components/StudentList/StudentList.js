import s from 'StudentList/StudentList.scss'
import {browserHistory} from 'react-router'
import Api from 'modules/Api'

export default class StudentList extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      students: []
    }
  }

  componentDidMount() {
    Api.db.post('student/getStudentsBySectionId', {id: "582942f04af8bd1c00a014fc"})
    .then(students => {
      console.log("students", students);
      this.setState({students: students});
    });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="studentListContainer">
        {this.state.students.map(function(student, i) {
          return(
            <div key={i} className="row">
              {/*<div className="columns three">
                {student.firstName} {student.lastName}
              </div>*/}
              <div className="columns three">
                {student.email}
              </div>
            </div>
          );
        }, this)}
      </div>
    )
  }
}
