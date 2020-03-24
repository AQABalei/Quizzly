import s from 'MetricSectionStudent/MetricSectionStudent.scss'
import SectionStudentBarChart from 'SectionStudentBarChart/SectionStudentBarChart.js'
import SectionStudentPieChart from 'SectionStudentPieChart/SectionStudentPieChart.js'
import Api from 'modules/Api.js'
export default class MetricSectionStudent extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    console.log("MetricSectionStudent");
    this.state = {
      pieData: [],
      barData: [],
      size: 0
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

    Api.db.post('section/numberOfCorrectAndIncorrectAnswersForStudent', {
      studentId: pr.student,
      sectionId: pr.section,
      courseId: pr.course
    })
    .then(data => {
      me.setState({
        barData: data,
        size: 4
      });
    });
    Api.db.post('section/getParticipationForStudent', {
      studentId: pr.student,
      courseId: pr.course
    }).then(data => {
      console.log("here");
      console.log(data);
      me.setState({
        pieData: data
      });
    });
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        <SectionStudentBarChart
          data={st.barData}
          size={st.size}
        />
        <SectionStudentPieChart
          data={st.pieData}
        />
      </div>
    )
  }
}
