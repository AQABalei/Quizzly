import s from 'MetricData/MetricData.scss'
import MetricSectionStudentQuiz from 'MetricSectionStudentQuiz/MetricSectionStudentQuiz.js'
import MetricSectionQuiz from 'MetricSectionQuiz/MetricSectionQuiz.js'
import MetricSectionStudent from 'MetricSectionStudent/MetricSectionStudent.js'
import MetricSection from 'MetricSection/MetricSection.js'
export default class MetricData extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    // this.state = {
    //   section : props.section,
    //   student : props.student,
    //   quiz : props.quiz,
    //   question : props.question
    // }
  }

  componentDidMount() {
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     section : nextProps.section,
  //     student : nextProps.student,
  //     quiz : nextProps.quiz,
  //     question: nextProps.question
  //   })
  // }
  renderChart(){
    var pr = this.props;
    console.log("rendering chart");
    console.log(pr.section);
    console.log(pr.student);
    console.log(pr.quiz);
    console.log(pr.question);
    //Specific section, student, and quiz
    if(pr.section != -1 && pr.student != -1 && pr.quiz != -1 && pr.question == -1){
      return (
        <MetricSectionStudentQuiz
          section={pr.section}
          student={pr.student}
          quiz={pr.quiz}
        />
      )
    }
    //Specific section and quiz
    else if(pr.section != -1 && pr.student == -1 && pr.quiz != -1 && pr.question == -1){
      console.log("here");
      return (
        <MetricSectionQuiz
          section={pr.section}
          quiz={pr.quiz}
        />
      )
    }
    //Specific section and student
    else if(pr.section != -1 && pr.student != -1 && pr.quiz == -1 && pr.question == -1){
      return (
        <MetricSectionStudent
          section={pr.section}
          student={pr.student}
          course={pr.course}
        />
      )
    }
    //Specific section
    else if(pr.section != -1 && pr.student == -1 && pr.quiz == -1 && pr.question == -1){
      return (
        <MetricSection
          section={pr.section}
          course={pr.course}
        />
      )
    }
    //No selection
    else if(pr.section == -1  && pr.student == -1 && pr.quiz == -1 && pr.question == -1){
      return (
        <MetricSection
          course={pr.course}
        />
      )
    }
  }
  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div>
      {this.renderChart()}
      </div>
    )
  }
}
