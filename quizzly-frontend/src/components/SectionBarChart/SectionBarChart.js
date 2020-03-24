import s from 'SectionBarChart/SectionBarChart.scss'
var rd3b = require('react-d3-basic');

var BarStackChart = rd3b.BarStackChart;
var width = 700,
   height = 400,
   chartSeries = [
     {
       field: 'Student Attendance',
       name: 'Student Attendance'
     }
   ],
   x = function(d) {
     return d.Name;
   },
   xScale = 'ordinal',
   yTickFormat = d3.format(".2s");
export default class SectionBarChart extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      yTicks : [props.size]
    }
  }

  componentWillReceiveProps(nextProps){
    // console.log("props changed");
    // console.log(nextProps.student);
    console.log(nextProps.size);
    this.setState({
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
        data= {this.props.data}
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
