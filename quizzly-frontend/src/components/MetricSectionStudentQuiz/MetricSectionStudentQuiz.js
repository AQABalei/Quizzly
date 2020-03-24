import s from 'MetricSectionStudentQuiz/MetricSectionStudentQuiz.scss'
import StudentQuizBarChart from 'SectionStudentQuizBarChart/SectionStudentQuizBarChart.js'
import Api from 'modules/Api.js'
import Solution from 'Solution/Solution.js'
import SectionStudentQuizPieChart from 'SectionStudentQuizPieChart/SectionStudentQuizPieChart.js'
export default class MetricSectionStudentQuiz extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      studentanswers: [],
      questions:[],
      name: "",
      size: 0,
      correct: 0,
      incorrect: 0
    }
  }

  componentDidMount() {
    this.renderChart();
  }
  componentWillReceiveProps(nextProps){
      this.renderChart(nextProps);
  }
  renderChart(props){
    var me = this;
    var pr = props || this.props;
    //
    Api.db.post('studentanswer/getMetrics', {
      student: pr.student,
      quiz: pr.quiz,
      section: pr.section })
    .then(metrics => {
      this.setState({
        questions: metrics.questions,
        size: metrics.size,
        correct: metrics.countCorrect,
        incorrect: metrics.countIncorrect,
        unanswered: metrics.countUnanswered
      });
    });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        <StudentQuizBarChart
          name={this.state.name}
          correct={this.state.correct}
          incorrect={this.state.incorrect}
          unanswered={this.state.unanswered}
          size={this.state.size}
        />
        <SectionStudentQuizPieChart
          correct={this.state.correct}
          incorrect={this.state.incorrect}
          unanswered={this.state.unanswered}
        />
        <Solution
          questions={this.state.questions}
        />
      </div>
    )
  }
}
