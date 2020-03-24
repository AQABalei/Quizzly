import s from 'EditCourseModal/EditCourseModal.scss'
import Modal from 'elements/Modal/Modal.js'
import Input from 'elements/Input/Input.js'

export default class EditCourseModal extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      course: props.course
    }
  }

  componentDidMount() {
  }

  courseTitleChange(value) {
    var course = this.state.course;
    course.title = value;
    this.setState({course: course});
  }

  renderModalBody() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="editCourseModalContainer">
        <div className="p20">
          <div className="inputContainer">
            <div className="mr15 nowrap" style={{"width":"94px"}}>Course title</div>
            <Input
              type="text"
              className=""
              placeholder="93020"
              value={st.course.title}
              onChange={this.courseTitleChange.bind(this)}
            />
          </div>
        </div>
        <div
          className="footerButton"
          onClick={pr.updateCourseInfo.bind(this, st.course)}
        >
          +
        </div>
      </div>
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <Modal
        title="Edit Course"
        body={this.renderModalBody()}
        closeModal={pr.closeModal.bind(this)}
      />
    )
  }
}
