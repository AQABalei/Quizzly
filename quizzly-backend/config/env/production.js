/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
 
require('dotenv').config();

module.exports = {

  // connections: {
  //   // prodMongo: {
  //   //   adapter: 'sails-mongo',
  //   //   url: process.env.MONGODB_URI
  //   // }
  //   // prodMySQL: {
  //   //   adapter: 'sails-mysql',
  //   //   host: process.env.MYSQL_HOST,
      
  //   // }
  // },

  models: {
    connection: 'prodMySQL'
  },

  pushSettings: {
    // // Android
    // gcm: {
    //   id: null, // PUT YOUR GCM SERVER API KEY,
    //   msgcnt: 1,
    //   dataDefaults: {
    //     delayWhileIdle: false,
    //     timeToLive: 4 * 7 * 24 * 3600, // 4 weeks
    //     retries: 4,
    //   },
    //   // Custom GCM request options https://github.com/ToothlessGear/node-gcm#custom-gcm-request-options
    //   options: {},
    // },

    // Apple
    apn: {
      data: {
        topic: 'edu.usc.quizzly',
        badge: 1,
        expiry: 1, // in hours
        defaultAlert: 'You have a new message!',
        sound: 'ping.aiff'
      },

      options: {
        cert: process.env.APN_CERT,
	token:{
          key:'config/env/certs/AuthKey_D4NYB4FRY6.p8',
          keyId:'D4NYB4FRY6',
          teamId:'G8TAR87RSB'
        },
        //key: process.env.APN_KEY,
        production: true
      },
    }
  }

};
