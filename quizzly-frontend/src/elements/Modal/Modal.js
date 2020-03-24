import s from 'elements/Modal/Modal.scss'
import Utility from 'modules/Utility.js'

export default class Modal extends React.Component {
  static propTypes = {
    title: React.PropTypes.any.isRequired,
    body: React.PropTypes.any.isRequired,
    closeModal: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    var st = this.state;
    var pr = this.props;

    return (
      <div className="modalContainer">
        <div className="modal">
          <div className="modalHeader">
            {pr.title}
            <span
              className="closeButton"
              onClick={pr.closeModal.bind(this)}
            >
              <img src={Utility.CLOSE_IMAGE_PATH} style={{"width":"12px"}} />
            </span>
          </div>
          <div className="modalBody">{pr.body}</div>
        </div>
      </div>
    )
  }
}
