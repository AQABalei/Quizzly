import s from 'Layout/Layout.scss'
import {browserHistory} from 'react-router'
import Sidebar from 'Sidebar/Sidebar.js'
import Header from 'Header/Header.js'
import ProfileModal from 'ProfileModal/ProfileModal.js'
import Session from 'modules/Session.js'
import Api from 'modules/Api.js'
import Utility from 'modules/Utility.js'
import Socket from 'modules/Socket.js'

export default class Layout extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      urbanAirshipPush: {},
      showProfileModal: false,
      course: {
        id: -1,
        title: "FAKE 101",
        quizzes: [],
        sections: []
      },
      term: {
        id: -1,
        season: {season: "Oalcoa"},
        year: {year: "1398"},
      },
      terms: [],
      user: {
        courses: [],
        email: "",
        firstName: "",
        lastName: "",
        facultyId: "",
        school: "",
        id: -1
      }
    }
  }

  getTermsFromCourses(courses) {
    var me = this;
    var termIds = [];
    courses.map(function(course) {
      termIds.push(course.term);
    });

    termIds = Utility.removeDuplicates(termIds);
    return Api.db.post('term/multifind', {termIds: termIds})
    .then(function(terms) {
      console.log("terms", terms);
      me.setState({
        term: terms[0],
        terms: terms
      });
      return terms;
    });
  }

  initPush() {
    var config = {
      key: 'RpquxajkQKeLnupkBrvWtw',
      secret: 'O8p2HuxVQBOrYaTersE5CA',
      masterSecret: 'Lcay6AUkQXapKaztfYSJGw'
    };

    // Create a push object
    // var urbanAirshipPush = new UrbanAirshipPush(config);
    // this.setState({urbanAirshipPush: urbanAirshipPush});
  }

  getQuestion() {
    var urbanAirshipPush = this.state.urbanAirshipPush;
    UrbanAirship.getNotification(function(object) {
      browserHistory("//" + object.question.id);
    });
  }

  showProfileModal() {
    this.setState({showProfileModal: true});
  }

  changeCourse(courseId) {
    this.getCourseById(courseId);
  }

  getCourseById(courseId) {
    var me = this;

    return Api.db.findOne('course', courseId)
    .then(function(course) {
      if(course == undefined) return; // if there are no courses, then there are no sections
      me.setState({course: course});
    });
  }

  changeTerm(termId) {
    var me = this;
    this.getTermByTermId(termId)
    .then(function() {
      var courseId = -1;
      me.state.user.courses.map(function(course) {
        if(courseId == -1 && course.term == termId) {
          courseId = course.id;
        }
      });
      if(courseId == -1) return;
      me.changeCourse(courseId);
    });
  }

  getTermByTermId(termId) {
    var me = this;
    return Api.db.findOne('term', termId)
    .then(function(term) {
      if(term == undefined) return; // if there are no courses, then there are no sections
      me.setState({term: term});
    });
  }

  addCourseToProfessor(course, term) {
    //TODO: add student array to section
    for(var i = 0; i < course.sections.length; ++i) { // this removes empty answers from the array
      if(course.sections[i].title.length == 0) {
        course.sections.splice(i, 1);
        --i;
      }
    }
    console.log("user", this.state.user);
    return Api.db.create('course', {title: course.title, professor: this.state.user.id, sections: course.sections, term: term.id})
    .then((course) => {
      console.log("created course", course);
      var user = this.state.user;
      course.quizzes = [];
      course.sections = [];

      user.courses.push(course);

      var isNewTerm = true;
      var terms = this.state.terms;
      for(var i = 0; i < terms.length; ++i) {
        if(terms[i].id == term.id) {
          isNewTerm = false;
          break;
        }
      }

      if(isNewTerm) {
        terms.push(term);
      }

      this.setState({
        user: user,
        course: course,
        term: term,
        terms: terms
      });
      return course;
    });
  }

  addStudentsToSection(sectionId, studentIds) {
    var me = this;
    return Api.db.post('section/updateStudents/' + sectionId, {studentIds: studentIds})
    .then((section) => {
      console.log("Updated section", section);
    });
  }

  deleteCourseFromProfessor(course) {
    console.log(">>>>>>>> deleting shit", course);
    var me = this;

    var sectionIds = [];
    course.sections.map(function(section){sectionIds.push(section.id);});
    var quizIds = [];
    course.quizzes.map(function(quiz){quizIds.push(quiz.id);});
    var questionIds = [];
    var answerIds = [];

    return Api.db.find('question', {quiz: quizIds})
    .then(function(questions) {
      console.log("questions", questions);
      console.log("quizIds", quizIds);
      questionIds = [];
      questions.map(function(question){ questionIds.push(question.id);});
      return Api.db.find('answer', {question: questionIds})
    })
    .then(function(answers) {
      answerIds = [];
      answers.map(function(answer){answerIds.push(answer.id);});
      return Api.db.post('course/destroy', {id: course.id});
      // return $.when(
      //   ,
        // $.post('/section/multidestroy', {ids: sectionIds}),
        // $.post('/quiz/multidestroy', {ids: quizIds}),
        // $.post('/question/multidestroy', {ids: questionIds}),
        // $.post('/answer/multidestroy', {ids: answerIds})
      // );
    })
    .then(function() {
      return Api.db.findOne('professor', me.state.user.id);
    })
    .then(function(user) {
      console.log("DELETED------------", user);
      var course = {};
      if(user.courses.length == 0) {
        course = {
          id: -1,
          title: "FAKE 101",
          quizzes: [],
          sections: []
        };
      } else {
        course = user.courses[0];
      }
      me.getTermsFromCourses(user.courses);
      me.setState({
        course: course,
        user: user
      });
    });
  }

  updateUser(user) {
    var courses = this.state.user.courses;
    user.courses = courses;
    this.setState({user: user});
  }

  closeModal() {
    this.setState({showProfileModal: false});
  }

  componentDidMount() {
    var user = Session.user;
    console.log('user', user);
    switch(user.type) {
      case 'STUDENT':
        Socket.subscribeToSections();
        var courseIds = [];
        user.sections.map((section) => {
          courseIds.push(section.course);
        });
        Api.db.post('course/multifind', {ids: courseIds})
        .then((courses) => {
          console.log('courseIds', courseIds);
          console.log('courses', courses);
          if(courses[0] != undefined) {
            this.getCourseById(courses[0].id);
            this.getTermsFromCourses(courses);
          }
          user.courses = courses;
          this.setState({user: user});
        });
        break;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        if(user.courses[0] != undefined) {
          this.getCourseById(user.courses[0].id);
          this.getTermsFromCourses(user.courses);
        }
        this.setState({user: user});
        break;
    }
    // });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    var props = {
      course: st.course,
      term: st.term,
    };

    switch(st.user.type) {
      case 'STUDENT':
        props.student = st.user
        break;
      case 'ADMINISTRATOR':
      case 'PROFESSOR':
        props.addCourseToProfessor = this.addCourseToProfessor.bind(this);
        props.deleteCourseFromProfessor = this.deleteCourseFromProfessor.bind(this);
        props.addStudentsToSection = this.addStudentsToSection.bind(this);
        break;
    }

    return (
      <div className="layoutContainer">
        <Sidebar
          user={st.user}
        />
        <Header
          course={st.course}
          courses={st.user.courses}
          term={st.term}
          terms={st.terms}
          user={st.user}
          changeCourse={this.changeCourse.bind(this)}
          changeTerm={this.changeTerm.bind(this)}
          showProfileModal={this.showProfileModal.bind(this)}
        />
        <div className="contentBody">
          {React.Children.map(pr.children, function(child) {
            return React.cloneElement(child, props);
          })}
        </div>
        {st.showProfileModal ?
          <ProfileModal
            user={st.user}
            updateUser={this.updateUser.bind(this)}
            closeModal={this.closeModal.bind(this)}
          />
          :
          null
        }
      </div>
    )
  }
}
