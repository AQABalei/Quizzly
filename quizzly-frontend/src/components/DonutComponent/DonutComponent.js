import s from 'DonutComponent/DonutComponent.scss'
var rd3 = require('react-d3');
var rd3b = require('react-d3-basic');
var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;
var barData = [
  {
    "name": "Number of questions correct",
    "values": [
      { "x": 1, "y":  3}
    ]
  },
  {
    "name": "Number of questions incorrect",
    "values": [
      { "x": 1, "y":  7}
    ]
  }
];
var data = [
  {
    "Name": "Jackson",
    "Questions Correct": 3,
    "Questions Incorrect": 4
  }
];
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
     }
   ],
   x = function(d) {
     return d.Name;
   },
   xScale = 'ordinal',
   yTickFormat = d3.format(".2s"),
   yTicks = [7];
var object = {
  x: 0,
  y: 0,
  width: 500,
  height: 400
}
var lineData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, { x: 24, y: 10 } ],
    strokeWidth: 3,
    strokeDashArray: "5,5",
  }
];
export default class DonutComponent extends React.Component {
  static propTypes = {
    dummy: React.PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div>
      <div className="chartContainer">
        <BarStackChart
          data= {data}
          width= {width}
          height= {height}
          chartSeries = {chartSeries}
          x= {x}
          xScale= {xScale}
          yTicks= {yTicks}/>
          <div className="testBring"></div>
      </div>
      <div className="questionsContainer">
        <div className="flex mb20 flexVertical">
          <input
            type="text"
            className={`normalInput`}
            value="Which of the following is a collaboration tool?"
            placeholder="Option..."
          />
        </div>
        <div className="flex mb20 flexVertical">
          <span
            className="mr15 greyButton"
          >
            A.)
          </span>
          <input
            type="text"
            className={`normalInput`}
            value="Asus"
            placeholder="Option..."
          />
        </div>
        <div className="flex mb20 flexVertical">
          <span
            className="mr15 greenButton"
          >
            B.)
          </span>
          <input
            type="text"
            className={`normalInput lightGreenBackground`}
            value="Slack"
            placeholder="Option..."
          />
        </div>
        <div className="flex mb20 flexVertical">
          <span
            className="mr15 greyButton"
          >
            C.)
          </span>
          <input
            type="text"
            className={`normalInput`}
            value="Banana"
            placeholder="Option..."
          />
        </div>
      </div>
      </div>
    )
  }
}
