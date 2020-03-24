import s from 'Download/Download.scss'
import Api from 'modules/Api.js'
import {browserHistory} from 'react-router'

export default class Download extends React.Component {
  static propTypes = {
    //dummy: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  downloadMacVersion() {

  }

  downloadWindowsVersion() {

  }

  render() {
    var st = this.state;
    var pr = this.props;
    return (
      <div className="downloadContainer">
        <div className="innerDownloadContainer">
          <h1 className="title">DOWNLOAD THE QUIZZLY POWERPOINT PLUGIN</h1>
          <div className="downloadLinks">
            <a
              href="Quizzly-PowerPoint.zip"
              download
            >
              DOWNLOAD
            </a>
          </div>
          <div
            className="backButton"
            onClick={() => {browserHistory.goBack()}}
          >
            &larr; Back
          </div>
        </div>
      </div>
    )
  }
}
