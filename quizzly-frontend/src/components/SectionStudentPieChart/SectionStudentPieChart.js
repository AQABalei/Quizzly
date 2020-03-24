import s from 'SectionStudentPieChart/SectionStudentPieChart.scss'
var rd3b = require('react-d3-basic');

var PieChart = rd3b.PieChart;
var width = 700,
   height = 400,
   chartSeries = [
     {
       field: 'Quizzes Taken',
       name: 'Quizzes Taken'
     },
     {
       field: 'Quizzes Missed',
       name: 'Quizzes Missed'
     }
   ],
   value = function(d) {
      return d ? +d.number : null;
   },
   name = function(d) {
      return d.type;
   };

export default class SectionStudentPieChart extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    console.log(props.data);
    this.state = {
      y: 0
    }
  }

  componentDidMount() {
  }
  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     y: 1
  //   });
  // }
  renderChart(){
    console.log(this.props.data);
    return(
          <PieChart
            data= {this.props.data}
            width= {width}
            height= {height}
            chartSeries= {chartSeries}
            value = {value}
            name = {name}
          />
        )
  }
  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        {this.renderChart()}
      </div>
    )
  }
}
