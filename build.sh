#!/bin/bash

mkdir -p ./es5
echo "Browserifying..."
npx browserify ./es6/index.js -s promiseObject > ./es5/index.temp.js
echo "Babelifying..."
npx babel ./es5/index.temp.js --presets=env --plugins=babel-plugin-transform-object-rest-spread -o ./es5/index.js
echo "Minifying output..."
npx uglifyjs ./es5/index.js > ./es5/index.min.js
echo "Cleaning up..."
rm ./es5/index.temp.js
echo "Done!"
