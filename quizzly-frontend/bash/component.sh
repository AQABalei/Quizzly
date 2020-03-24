#!/bin/bash
component=$1
componentContainer="${component,}Container"
folderPath="src/components/$component"

echo "Creating Component with name: $component"
echo "..."

if [ -d "$folderPath" ]; then
  echo "!!! The path $folderPath already exists!"
  echo "!!! You must delete this folder to run the script."
  exit
fi

mkdir "$folderPath"
echo "$folderPath/"

cat >"$folderPath/$component.js" <<EOF
import s from '$component/$component.scss'

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
      <div className="$componentContainer">
      </div>
    )
  }
}
EOF

echo "├──$component.js"

cat >"$folderPath/$component.scss" <<EOF
@import "~assets/scss/vars.scss";

.$componentContainer {

}
EOF

echo "└──$component.scss"
echo "..."
echo "Success"
