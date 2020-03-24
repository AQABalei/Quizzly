import s from 'Lectures/Lectures.scss'
import Lecture from 'Lecture/Lecture.js'
import LecturePanel from 'LecturePanel/LecturePanel.js'
import Api from 'modules/Api.js'
import Session from 'modules/Session.js'

export default class Lectures extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      lectures: [],
      isLecture: false,
      lecture: {
        title: '',
        lectureItems: []
      },
      lectureIndex: -1,
    }
  }

  componentWillMount() {
    this.getLectures();
  }

  componentDidMount() {
    console.log("this.props", this.props);
  }

  getLectures() {
    return Api.db.post('full/lectures', {course: this.props.course.id})
    .then((lectures) => {
      console.log(">>>>> fullLectures", lectures);
      this.setState({lectures: lectures});
    });
  }

  lectureChange(e) {
    var lecture = this.state.lecture;
    lecture.title = e.target.value;
    this.setState({lecture: lecture});
  }

  showLecture() {
    this.setState({isLecture: true});
  }

  showLectures() {
    this.setState({isLecture: false});
  }

  addQuizToLecture(quiz) {
    var lectureQuiz = {
      type: "QUIZ",
      quiz: quiz,
    };
    var lecture = this.state.lecture;
    lecture.lectureItems.push(lectureQuiz);
    this.setState({lecture: lecture});
  }

  addQuestionToLecture(question) {
    var lectureQuestion = {
      type: "QUESTION",
      question: question,
    };
    var lecture = this.state.lecture;
    lecture.lectureItems.push(lectureQuestion);
    this.setState({lecture: lecture});
  }

  removeItemFromLecture(i) {
    var lecture = this.state.lecture;
    lecture.lectureItems.splice(i, 1);
    this.setState({lecture: lecture});
  }

  saveLecture() {
    var lecture = this.state.lecture;
    lecture.course = this.props.course;
    lecture.professor = Session.user;
    Api.db.post('createLecture', lecture)
    .then((lecture) => {
      return Api.db.find('lecture', {course: this.props.course.id});
    })
    .then((lectures) => {
      console.log("&&&&& lectures", lectures);
      this.setState({lectures: lectures});
    })
  }

  selectLecture(lecture) {
    // Api.db.post('lecture/full', {course: this.props.course.id})
    // .then((lecture) => {
    //
    // });
    this.setState({
      lecture: lecture,
      isLecture: true
    });
  }

  renderLecture() {
    var st = this.state;
    return (
      <Lecture
        {...this.props}
        lecture={st.lecture}
        lectureIndex={st.lectureIndex}
        showLectures={this.showLectures.bind(this)}
        lectureChange={this.lectureChange.bind(this)}
        saveLecture={this.saveLecture.bind(this)}
        addQuizToLecture={this.addQuizToLecture.bind(this)}
        addQuestionToLecture={this.addQuestionToLecture.bind(this)}
        removeItemFromLecture={this.removeItemFromLecture.bind(this)}
      />
    );
  }

  renderLecturePanels() {
    return this.state.lectures.map((lecture, i) => {
      return (
        <LecturePanel
          key={i}
          lecture={lecture}
          selectLecture={this.selectLecture.bind(this)}
        />
      );
    })
  }

  renderLectures() {
    return (
      <div>
        {this.renderLecturePanels()}
        <div
          className="addEntityButton"
          onClick={this.showLecture.bind(this)}
        >
          +
        </div>
      </div>
    );
  }

  renderLectureContent() {
    var st = this.state;
    if(st.isLecture) {
      return this.renderLecture();
    } else {
      return this.renderLectures();
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="lecturesContainer">
        <div className="quizzlyContent">
          {this.renderLectureContent()}
        </div>
      </div>
    )
  }
}
