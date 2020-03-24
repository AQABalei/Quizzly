import s from 'elements/Panel/Panel.scss'

export default class Panel extends React.Component {
  static propTypes = {
    header: React.PropTypes.any.isRequired,
    body: React.PropTypes.any.isRequired,
    footer: React.PropTypes.any.isRequired,
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
      <div className="panelContainerQuiz">
        <div className="panelHeader">
          {pr.header}
        </div>
        <div className="panelBody">
          {pr.body}
        </div>
        <div className="panelFooterNew">
          {pr.footer}
        </div>
      </div>
    )
  }
}
