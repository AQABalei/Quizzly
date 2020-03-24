#!/usr/local/bin/bash
module=$1
filePath="src/modules/$module.js"

echo "Creating Module with name: $module"
echo "..."

if [ -f "$filePath" ]; then
  echo "!!! The file $filePath already exists!"
  echo "!!! You must delete this file to run the script."
  exit
fi

cat >"$filePath" <<EOF
module.exports = {
  dummy: function(param) {
    return param;
  },
};
EOF

echo "src/modules/"
echo "└──$module.js"

echo "..."
echo "Success"
