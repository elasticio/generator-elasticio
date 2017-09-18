'use strict';

/**
* This function will be called by the platform to verify given credentials
*
**/
module.exports = function (credentials, cb) {
  console.log('Credentials passed for verification %j', credentials);
  return Promise.resolve(true);
};
