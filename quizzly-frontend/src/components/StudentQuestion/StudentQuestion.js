import s from 'StudentQuestion/StudentQuestion.scss'

export default class StudentQuestion extends React.Component {
  static propTypes = {
    studentQuizIndex: React.PropTypes.number.isRequired,
    studentAnswerIndex: React.PropTypes.number.isRequired,
    studentAnswer: React.PropTypes.object.isRequired,
    showModal: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  componentDidMount() {
  }

  mouseEnter() {
    this.setState({hover: true});
  }

  mouseLeave() {
    this.setState({hover: false});
  }

  render() {
    var st = this.state;
    var pr = this.props;
    var status = "correct";

    var t = new Date();
    t.setSeconds(t.getSeconds() - pr.question.duration);
    // console.log(t)
    // console.log(pr.question.lastAsked)
    // console.log(t < new Date(pr.question.lastAsked));
    if (t < new Date(pr.question.lastAsked)) {
      status = "open";
    }
    else if(pr.question.incorrect || pr.question.studentUnanswered) {
      status = "wrong";
    }
    // console.log(status);

    return (
      <div
        className={`studentQuestionContainer ${status} pointer`}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseLeave={this.mouseLeave.bind(this)}
        onClick={pr.showModal.bind(this, pr.question)}
      >
        {pr.question.text}
      </div>
    )
  }
}
