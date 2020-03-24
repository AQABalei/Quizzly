import s from 'EditSectionModal/EditSectionModal.scss'
import Modal from 'elements/Modal/Modal.js'
import Input from 'elements/Input/Input.js'

export default class EditSectionModal extends React.Component {
  static propTypes = {
    section: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      section: props.section
    }
  }

  componentDidMount() {
  }

  sectionTitleChange(value) {
    var section = this.state.section;
    section.title = value;
    this.setState({section: section});
  }

  sectionAliasChange(value) {
    var section = this.state.section;
    section.alias = value;
    this.setState({section: section});
  }

  renderModalBody() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="editSectionModalContainer">
        <div className="p20">
          <div className="inputContainer">
            <div className="mr15" style={{"width":"45px"}}>Title</div>
            <Input
              type="text"
              className=""
              placeholder="93020"
              value={st.section.title}
              onChange={this.sectionTitleChange.bind(this)}
            />
          </div>
          <div className="inputContainer">
            <div className="mr15" style={{"width":"45px"}}>Alias</div>
            <Input
              type="text"
              className=""
              placeholder="Mon 3pm Section"
              value={st.section.alias}
              onChange={this.sectionAliasChange.bind(this)}
              onEnter={pr.updateSectionInfo.bind(this, st.section, pr.sectionIndex)}
            />
          </div>
        </div>
        <div
          className="footerButton"
          onClick={pr.updateSectionInfo.bind(this, st.section, pr.sectionIndex)}
        >
          +
        </div>
      </div>
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <Modal
        title="Edit Section"
        body={this.renderModalBody()}
        closeModal={pr.closeModal.bind(this)}
      />
    )
  }
}
