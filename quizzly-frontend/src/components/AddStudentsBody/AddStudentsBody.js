import s from 'AddStudentsBody/AddStudentsBody.scss'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'
import ReactFileReader from 'react-file-reader';

export default class AddStudentsBody extends React.Component {
  static propTypes = {
    section: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      studentEmails: ""
    };
  }

  componentDidMount() {
    Api.db.findOne('section', this.props.section.id)
    .then((section) => {
      var studentEmails = "";
      section.students.map((student) => {
        studentEmails += student.email + "\n";
      });
      this.setState({studentEmails: studentEmails});
    });
  }

  handleChange(event) {
    this.setState({studentEmails: event.target.value});
  }

  updateState(newState) {
    this.setState({studentEmails: newState});
  }

  addStudentsToSection() {
    var studentEmails = this.state.studentEmails;
    studentEmails = studentEmails.split("\n");

    Api.db.post('student/getStudentIdsFromEmails/', {studentEmails: studentEmails})
    .then((studentIds) => {
      studentIds = Utility.removeDuplicates(studentIds);
      this.props.addStudentsToSection(this.props.section.id, studentIds);
    });
  }

  handleFiles = files => {
    var reader = new FileReader();
    var studentEmails = this.state.studentEmails;
    reader.onload = () => {
      // Use reader.result
      // console.log(reader.result);
      var studentEmails = document.getElementById('studentEmailsID').value;
      studentEmails += reader.result;
      document.getElementById('studentEmailsID').value = studentEmails;
      console.log(studentEmails);
      // console.log(JSON.stringify(studentEmails.replace(/[\r]/g, "")));
      // this.setState(studentEmails: studentEmails);
      this.updateState(studentEmails.replace(/[\r]/g, ""));
    };
    reader.readAsText(files[0]);
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="addStudentsBodyContainer">
        <div className="p20">
          <div className="">
            <div className="pb10 alignC">Add one student email per line in section: {pr.section.title}</div>
            <textarea
              className="normalInput centerBlock alignC pr20"
              id="studentEmailsID"
              placeholder="Student emails..."
              value={st.studentEmails}
              onChange={this.handleChange.bind(this)}
              rows={10}
              style={{resize: "vertical", maxWidth: "350px"}}
            />
          </div>
        </div>
        <div className="rowC">
          <button className="rounded-button rowBtn">
            <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                <div
                  className=""
                >
                  UPLOAD CSV
                </div>
            </ReactFileReader>
          </button>
          <button
            className="rounded-button rowBtn"
            onClick={this.addStudentsToSection.bind(this)}
          >
            SAVE STUDENTS
          </button>
        </div>
      </div>
    )
  }
}
