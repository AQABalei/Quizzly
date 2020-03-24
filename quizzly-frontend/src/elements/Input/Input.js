import s from 'elements/Input/Input.scss'
import StringValidator from '../../modules/StringValidator.js'

export default class  extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.any.isRequired,
    label: React.PropTypes.string,
    required: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    onEnter: React.PropTypes.func,
    isInteger: React.PropTypes.bool,
    isDecimal: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    inputType: React.PropTypes.string,
  }

  onChange(event) {
    var value = event.target.value;
    this.props.onChange(value);
  }

  onKeyPress(event) {
    if(this.props.isInteger) {
      if(!StringValidator.isIntegerFromCharCode(event.charCode)) {
        event.preventDefault();
      }
    } else if(this.props.isDecimal) {
      if(!StringValidator.isDecimalFromCharCode(event.charCode)) {
        event.preventDefault();
      }
    }
    if(event.key == 'Enter'){
      this.props.onEnter();
    }
  }

  chooseInputClass() {
    switch (this.props.inputClass) {
      case 'normalInput':
        return 'normalInput';
      case 'entranceInput':
        return 'entranceInput';
      default:
        return "normalInput";
    }
  }

  render() {
    var st = this.state;
    var pr = this.props;
    var inputClass = this.chooseInputClass();

    return (
      <input
        className={`${inputClass} ${pr.className ? pr.className : ""} ${pr.isError ? "error" : ""}`}
        style={pr.style ? pr.style : {}}
        type={pr.type ? pr.type : "text"}
        value={pr.value}
        placeholder={pr.placeholder ? pr.placeholder : ""}
        name={pr.name ? pr.name : ""}
        required={pr.required ? true : false}
        onChange={this.onChange.bind(this)}
        onKeyPress={this.onKeyPress.bind(this)}
      />
    )
  }
}
