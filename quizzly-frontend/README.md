
# Quizzly Frontend #

## Installation and Setup ##

1. Environment configuration:
  * In the base directory there is a file called `.env.template`, copy the contents of this file into a new file called `.env` within the same cacheDirectory
  * Update the values in `.env` to match the desired configuration, the end product should look something like this if your production url was usc.edu:
  > NODE_ENV=development <br/>
  > DEV_ROOT_URL=http://localhost:1337 <br/>
  > PROD_ROOT_URL=http://www.usc.edu

2. Use `npm install` to install all node packages

3. Use `npx webpack` to create the webpack bundle
  * This is also built into `npm start` as mentioned in the next list item


3. Use `npm start` to run the server in development, this will automatically build the webpack bundle


## Helpful tips ##

1. Configuring `process.env`
  * If a new value ever needs to be added to the `process.env` object add it to the webpack.config.js file where instances of the code below occur
  > new webpack.DefinePlugin({ <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;'process.env': { <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'NODE_ENV': JSON.stringify('production'), <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'DEV_ROOT_URL': JSON.stringify(process.env.DEV_ROOT_URL), <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'PROD_ROOT_URL': JSON.stringify(process.env.PROD_ROOT_URL) <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;} <br/>
      })
  * If a lot more environment variables are needed in the future, it may be best to use a package that can automate the assignment of `process.env` variables like `webpack-dotenv`

2. Use predefined `.scss` variables when possible, most are available within `public/assets/scss`

3. The `npm start` command can be customized in `package.json`

## Contact ##

Dear Fall 2018 Team,

If you need any additional information, on some of the web stuff that I may have missed, you can email me at byargeone@gmail.com (I graduated so I don't have my usc.edu email anymore).

Best,

Erik Byargeon
