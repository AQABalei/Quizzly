import s from 'MetricSection/MetricSection.scss'
import SectionBarChart from 'SectionBarChart/SectionBarChart.js'
import Api from 'modules/Api.js'
export default class MetricSection extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: [],
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
    var coursesection = pr.section ? {courseId: pr.course,
    sectionId: pr.section} : {courseId: pr.course};
    Api.db.post('section/sectionStudentAttendance', coursesection)
    .then(data => {
      console.log(data);
      me.setState({
        data: data,
        size: 6
      });
    });
    // this.setState({
    //   data : [
    //     {
    //       "Name": "Business",
    //       "Student Attendance": 5
    //     },
    //     {
    //       "Name": "Group Work",
    //       "Student Attendance": 3
    //     }
    //   ]
    // });

  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        <SectionBarChart
          data={st.data}
          size={st.size}
        />
      </div>
    )
  }
}
