#!/usr/local/bin/bash
element=$1
elementContainer="${element,}Container"
folderPath="src/elements/$element"

echo "Creating Element with name: $element"
echo "..."

if [ -d "$folderPath" ]; then
  echo "!!! The path $folderPath already exists!"
  echo "!!! You must delete this folder to run the script."
  exit
fi

mkdir "$folderPath"
echo "$folderPath/"

cat >"$folderPath/$element.js" <<EOF
import s from 'elements/$element/$element.scss'

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
      <div className="$elementContainer">
      </div>
    )
  }
}
EOF

echo "├──$element.js"

cat >"$folderPath/$element.scss" <<EOF
@import "~assets/scss/vars.scss";
@import "~assets/scss/global.scss";

.$elementContainer {

}
EOF

echo "└──$element.scss"
echo "..."
echo "Success"
