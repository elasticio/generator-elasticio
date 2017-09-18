'use strict';

/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
**/
module.exports = function (credentials) {
  console.log('Credentials passed for verification %j', credentials);
  return Promise.resolve(true);
};
