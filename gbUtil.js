'use strict';

const bcrypt = require('bcryptjs');

const logger = require('./gb_logger').logger;

const gbUtil = exports;

gbUtil.genHexId = function (n, deli) {
  var id = '';
  for (var i = 0; i < n; ++i)
    id += ('00' + Math.floor(Math.random() * 255).toString(16)).substr(-2) + deli
  if (deli == "")
    return (id.toUpperCase());
  else
    return (id.slice(0, -1).toUpperCase());
}

gbUtil.dateToRtcStr = function (d) {
  return String('0000' + d.getFullYear()).slice(-4) +
    String('00' + (d.getMonth() + 1)).slice(-2) +
    String('00' + d.getDate()).slice(-2) +
    String('00' + d.getHours()).slice(-2) +
    String('00' + d.getMinutes()).slice(-2) +
    String('00' + d.getSeconds()).slice(-2);
}

gbUtil.dateToDbStr = function (d) {
  return String('0000' + d.getFullYear()).slice(-4) + "/" +
    String('00' + (d.getMonth() + 1)).slice(-2) + "/" +
    String('00' + d.getDate()).slice(-2) + " " +
    String('00' + d.getHours()).slice(-2) + ":" +
    String('00' + d.getMinutes()).slice(-2) + ":" +
    String('00' + d.getSeconds()).slice(-2);
}

gbUtil.rtcToDbStr = function (d) {
  return d.slice(0, 4) + "/" + d.slice(4, 6) + "/" + d.slice(6, 8) + " " +
    d.slice(8, 10) + ":" + d.slice(10, 12) + ":" + d.slice(12, 14);
}

gbUtil.dbDateToRtc = function (d) {
  return d.replace(/[ :\/]/g, '');
}

gbUtil.encryptPassword = function (password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err)
      return callback(err);
    bcrypt.hash(password, salt, function (err, hash) {
      return callback(err, hash);
    });
  });
};

gbUtil.comparePassword = function (password, userPassword, callback) {
  bcrypt.compare(password, userPassword, function (err, isPasswordMatch) {
    if (err)
      return callback(err);
    return callback(null, isPasswordMatch);
  });
};