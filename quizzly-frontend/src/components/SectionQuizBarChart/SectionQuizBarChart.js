import s from 'SectionQuizBarChart/SectionQuizBarChart.scss'
var rd3b = require('react-d3-basic');

var BarChart = rd3b.BarChart;
var width = 700,
    height = 400,
    title = "Bar Chart",
    chartSeries = [
      {
        field: 'Questions Correct',
        name: 'Questions Correct'
      }
    ],
    x = function(d) {
      return d.Name;
    },
    xScale = 'ordinal',
    xLabel = "Student",
    yLabel = "Total # questions";

export default class SectionQuizBarChart extends React.Component {
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
    this.setState({
      yTicks : [nextProps.size]
    });
    // console.log(this.state.student);
    // this.renderChart();

  }

  componentDidMount() {
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="">
        <BarChart
          title= {title}
          data= {pr.data}
          width= {width}
          height= {height}
          chartSeries = {chartSeries}
          x= {x}
          xLabel= {xLabel}
          xScale= {xScale}
          yTicks= {st.yTicks}
          yLabel = {yLabel}
        />
      </div>
    )
  }
}
