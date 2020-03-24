import s from 'Style/Style.scss'

export default class Style extends React.Component {
  static propTypes = {
    // dummy: React.PropTypes.object.isRequired,
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
      <div className="styleContainer">
        <div className="pt20 p alignC">Style Page</div>
        <div className="p20 row flexCenter" style={{flexShrink: 0}}>
          <div className="colorSquare greenBlueGradient">
            <div className="p" style={{"color":"white"}}>
              <div>color: #32F1A8</div>
              <div>color: #32D7EF</div>
            </div>
          </div>
          <div className="colorSquare lightGreenBackground">
            <div className="p">color: #D9FFF0</div>
          </div>
          <div className="colorSquare lightBlueBackground"><div className="p">color: #E1FBFF</div>
          </div>
          <div className="colorSquare whiteBackground">
            <div className="p">color: #FFFFFF</div>
          </div>
          <div className="colorSquare lightestGrayBackground">
            <div className="p">color: #F6F7F8</div>
          </div>
          <div className="colorSquare lightGrayBackground">
            <div className="p">color: #E1E1E1</div>
          </div>
          <div className="colorSquare grayBackground mb20">
            <div className="p" style={{"color":"white"}}>color: #838383</div>
          </div>
        </div>
        <div className="row alignC pb20">
          <p>Paragraph</p>
          <button className="h1 round greenBlueGradient p10 mr20" style={{"color":"white"}}>HEADING 1</button>
          <br/>
          <br/>
          <button className="h3 round greenBlueGradient p10">HEADING 3</button>
        </div>
      </div>
    )
  }
}
