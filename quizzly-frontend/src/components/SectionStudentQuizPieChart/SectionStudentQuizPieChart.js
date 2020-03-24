import s from 'SectionStudentQuizPieChart/SectionStudentQuizPieChart.scss'

var rd3b = require('react-d3-basic');

var PieChart = rd3b.PieChart;
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
   value = function(d) {
      return +d.number;
   },
   name = function(d) {
      return d.type;
   };

export default class SectionStudentQuizPieChart extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data : [
        {
          "type": "Questions Correct",
          "number": props.correct
        },
        {
          "type": "Questions Incorrect",
          "number": props.incorrect
        },
        {
          "type": "Questions Unanswered",
          "number": props.unanswered
        }
      ]
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log("props changed");
    // console.log(nextProps.student);
    this.setState({
      data : [
        {
          "type": "Questions Correct",
          "number": nextProps.correct
        },
        {
          "type": "Questions Incorrect",
          "number": nextProps.incorrect
        },
        {
          "type": "Questions Unanswered",
          "number": nextProps.unanswered
        }
      ]
    });

  }

  componentDidMount() {
  }

  renderChart(){
    return(
          <PieChart
            data= {this.state.data}
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
