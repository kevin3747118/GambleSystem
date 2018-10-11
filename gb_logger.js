'use strict';

var alzk_logger = exports;

const winston = require('winston');
const util= require("./gbUtil");

alzk_logger.logger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true
    }),
    new (winston.transports.File)({
      name: "default",
      filename: logDir+`/dg-${util.dateToRtcStr(new Date())}.log`,
      timestamp: true,
      maxsize: 1024000,   // 1M
      maxFiles: 10,
      tailable: true,
      zippedArchive: false,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false
    })
  ],
  exitOnError: false
});
