import s from 'AddCourseBody/AddCourseBody.scss'
import Input from 'elements/Input/Input.js'
import Api from 'modules/Api.js'

export default class AddCourseBody extends React.Component {
  static propTypes = {
    addCourseToProfessor: React.PropTypes.func.isRequired,
    addSectionToCourse: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isAddCourse: false,
      course: {
        title: "",
        placeholder: "Course...",
        sections: [
          {title: "", placeholder: "Section..."}
        ]
      },
      terms: [],
      term: {}
    };
  }

  componentDidMount() {
    Api.db.find('term')
    .then(terms => {
      this.setState({
        term: terms[0],
        terms: terms
      });
    });
  }

  changeTerm(event, termIndex) {
    Api.db.findOne('term', event.target.value)
    .then(term => {
      this.setState({term: term});
    });
  }

  handleCourseChange(value) {
    var course = this.state.course;
    course.title = value;
    this.setState({course: course});
  }

  handleSectionChange(i, event) {
    var course = this.state.course;
    course.sections[i].title = event.target.value;

    this.setState({course: course});
  }

  addSection() {
    var sections = this.state.course.sections;
    var section = {title: "", placeholder: "Section..."};
    sections.push(section);
    this.setState({sections: sections});
  }

  showAddCourse() {
    if(this.state.isAddCourse) return;

    var course = {
      title: "",
      placeholder: "Course...",
      sections: []
    };
    this.setState({
      isAddCourse: true,
      course: course
    });
  }

  showAddSection() {
    if(!this.state.isAddCourse) return;

    var course = {
      title: "",
      placeholder: "",
      sections: [
        {title: "", placeholder: "Section..."}
      ]
    };
    this.setState({
      isAddCourse: false,
      course: course
    });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    var addButton;
    var footerButton;
    var courseInput;

    if(st.isAddCourse) {
      courseInput = (
        <div className="flex mb20 flexVertical">
          <Input
            type="text"
            placeholder={st.course.placeholder}
            value={st.course.title}
            onChange={this.handleCourseChange.bind(this)}
            onEnter={pr.addCourseToProfessor.bind(this, st.course, st.term)}
          />
          <select value={st.term.id} className="dropdown ml10" onChange={this.changeTerm.bind(this)}>
            {st.terms.map(function(term, termIndex) {
              return <option key={termIndex} value={term.id}>{term.season.season + " " + term.year.year}</option>
            })}
          </select>
        </div>
      );
      addButton = <div className="modalButton" onClick={pr.addCourseToProfessor.bind(this, st.course, st.term)}>ADD COURSE</div>
      footerButton = <div className="footerButton" onClick={this.addSection.bind(this)} >+</div>
    } else {
      courseInput = null;
      addButton = <div
        className="modalButton"
        onClick={pr.addSectionToCourse.bind(this, st.course.sections[0])}
      >
        ADD SECTION
      </div>
      footerButton = null;
    }

    return (
      <div className="addCourseBodyContainer">
        <div className="row">
          <div className="six columns p20 pr10">
            <div className={"modalButton " + (st.isAddCourse ? "opacity40" : "")} onClick={this.showAddSection.bind(this)}>NEW SECTION</div>
          </div>
          <div className="six columns p20 pl10">
            <div className={"modalButton " + (st.isAddCourse ? "" : "opacity40")} onClick={this.showAddCourse.bind(this)}>NEW COURSE</div>
          </div>
        </div>
        <div className="pl20 pr20">
          {courseInput}
          {st.course.sections.map((section, i) => {
            return (
              <div key={i} className="flex mb20 flexVertical">
                <input
                  type="text"
                  className='normalInput'
                  placeholder={section.placeholder}
                  value={section.title}
                  onChange={this.handleSectionChange.bind(this, i)}
                  key={i}
                />
              </div>
            );
          })}
        </div>
        <div className="pb20 pl20 pr20">
          {addButton}
        </div>
        {footerButton}
      </div>
    )
  }
}
