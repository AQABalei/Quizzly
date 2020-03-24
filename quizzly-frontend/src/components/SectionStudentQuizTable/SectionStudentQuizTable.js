import s from 'SectionStudentQuizTable/SectionStudentQuizTable.scss'
import 'react-table/react-table.css'
var ReactTable = require('react-table').default

var width = 700,
   height = 400;

export default class SectionStudentQuizTable extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      data: []
    }
  }

  componentWillReceiveProps(nextProps){
    console.log("table props changed");
    console.log(nextProps.columns);
    console.log(nextProps.data);
    this.setState({
      columns: nextProps.columns,
      data: nextProps.data
    });

  }

  componentDidMount() {
  }

  render() {
    // console.log("Table")
    return (
      <ReactTable
        data={this.state.data}
        columns={this.state.columns}
        filterable
      />
    )
  }
}
