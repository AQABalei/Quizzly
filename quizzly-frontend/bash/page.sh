#!/usr/local/bin/bash
page=$1
pageContainer="${page,}Container"
folderPath="src/pages/$page"

echo "Creating Page with name: $page"
echo "..."

if [ -d "$folderPath" ]; then
  echo "!!! The path $folderPath already exists!"
  echo "!!! You must delete this folder to run the script."
  exit
fi

mkdir "$folderPath"
echo "$folderPath/"

cat >"$folderPath/$page.js" <<EOF
import s from 'pages/$page/$page.scss'

export default class $component extends React.Component {
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
      <div className="$pageContainer">
      </div>
    )
  }
}
EOF

echo "├──$page.js"

cat >"$folderPath/$page.scss" <<EOF
@import "~assets/scss/vars.scss";

.$pageContainer {

}
EOF

echo "└──$page.scss"
echo "..."
echo "Success"
