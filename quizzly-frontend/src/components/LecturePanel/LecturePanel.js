import s from 'LecturePanel/LecturePanel.scss'
import Panel from 'elements/Panel/Panel.js'

export default class LecturePanel extends React.Component {
  static propTypes = {
    lecture: React.PropTypes.object.isRequired,
    selectLecture: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
    console.log("pr.lecture", this.props.lecture);
  }

  renderHeader() {
    var pr = this.props;
    return (
      <div
        className="pointer"
        onClick={pr.selectLecture.bind(this, pr.lecture)}
      >
        {pr.lecture.title}
      </div>
    );
  }

  renderQuizItem(lectureItem) {
    return (
      <div>
        <div className="lectureQuizItem">
          Quiz: {lectureItem.quiz.title}
        </div>
        {lectureItem.quiz.questions.map((question, i) => {
          return (
            <div
              key={i}
              className="innerQuestionItem"
            >
              {question.text}
            </div>
          );
        })}
      </div>
    );
  }

  renderQuestionItem(lectureItem) {
    return (
      <div>
        {lectureItem.question.text}
      </div>
    );
  }

  renderLectureItem(lectureItem) {
    switch (lectureItem.type) {
      case 'QUIZ':
        return this.renderQuizItem(lectureItem);
      case 'QUESTION':
        return this.renderQuestionItem(lectureItem);
    }
  }

  renderBodyRow() {
    return this.props.lecture.lectureItems.map((lectureItem, i) => {
      return (
        <div
          key={i}
          className="panelItem lecturePanelItem"
        >
          {this.renderLectureItem(lectureItem)}
        </div>
      );
    })
  }

  renderBody() {
    var pr = this.props;
    return (
      <div
      >
        {this.renderBodyRow()}
      </div>
    );
  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <Panel
        header={this.renderHeader()}
        body={this.renderBody()}
        //footer={pr.lecture.title}
      />
    )
  }
}
