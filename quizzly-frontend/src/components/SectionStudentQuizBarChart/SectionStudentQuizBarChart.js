import s from 'SectionStudentQuizBarChart/SectionStudentQuizBarChart.scss'

var rd3b = require('react-d3-basic');

var BarStackChart = rd3b.BarStackChart;
var width = 700,
   height = 400,
   chartSeries = [
     {
       field: 'Questions Correct',
       name: 'Questions Correct'
     },
     {
       field: 'Questions Incorrect',
       name: 'Questions Incorrect'
     },
     {
       field: 'Questions Unanswered',
       name: 'Questions Unanswered'
     }
   ],
   x = function(d) {
     return d.Name;
   },
   xScale = 'ordinal',
   yTickFormat = d3.format(".2s");


export default class SectionStudentQuizBarChart extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      // correct : props.correct,
      // student : props.name,
      // incorrect : props.incorrect,
      data : [
        {
          "Name": props.name,
          "Questions Correct": props.correct,
          "Questions Incorrect": props.incorrect,
          "Questions Unanswered": props.uncorrect
        }
      ],
      yTicks : [props.size]
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log("props changed");
    // console.log(nextProps.student);
    this.setState({
      data : [
        {
          "Name": nextProps.name,
          "Questions Correct": nextProps.correct,
          "Questions Incorrect": nextProps.incorrect,
          "Questions Unanswered": nextProps.unanswered
        }
      ],
      yTicks : [nextProps.size]
    });
    // console.log(this.state.student);
    // this.renderChart();

  }

  componentDidMount() {
  }

  renderChart(){
    return (
      <BarStackChart
        data= {this.state.data}
        width= {width}
        height= {height}
        chartSeries = {chartSeries}
        x= {x}
        xScale= {xScale}
        yTicks= {this.state.yTicks}/>
    )
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="chartContainer">
        {this.renderChart()}
      </div>
    )
  }
}
