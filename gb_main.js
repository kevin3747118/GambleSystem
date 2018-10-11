process.on('uncaughtException', (err) => {
  console.error('whoops! there was an error:' + err);
});

// process.setMaxListeners(50);

gbConsts = {}; // global variable
configDir = './.gbConfig';
logDir = './log';
// otaDir = './ota_download';

const logger = require('./gb_logger').logger;
const winston = require('winston');
const mysql = require('mysql');
const util = require('./gbUtil');
// const TestCase = require('./model/alzk_testCase').TestCase;

// TESTCASE = new TestCase();
// VLOCKTIMERS = [];

gbConsts = require(configDir + '/gbConfig.json');

try {
  gbConsts.DBPOOL = mysql.createPool({
    connectionLimit: gbConsts.DBPOOL_MAX,
    host: gbConsts.HOST_IP,
    port: gbConsts.ALZK_DB_PORT,
    user: gbConsts.ALZK_DB_USER,
    password: gbConsts.ALZK_DB_PWD,
    database: gbConsts.ALZK_DB_NAME,
    typeCast: function (field, next) {
      if (field.type == 'JSON') return (JSON.parse(field.string()));
      return next();
    },
    queryFormat: function (query, values) {
      if (!values) return query;
      return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
          if (Array.isArray(values[key]) || typeof (values[key]) == "object") {
            return this.escape(JSON.stringify(values[key]));
          } else
            return this.escape(values[key]);
        }
        return txt;
      }.bind(this));
    }
  });
} catch (err) {
  logger.error("alzk database conn pool init fail:" + err);
  process.exit(-1);
};


const mUtil = require("./model/util");
const express = require('express'); // call express
const bodyParser = require('body-parser');
const gbApp = express();

gbApp.use(bodyParser.urlencoded({
  extended: true
}));
gbApp.use(bodyParser.json());

const gbRouter = require("./gb_router");
gbApp.use('/gbApi', gbRouter); // need to modify

// begin of gamble system
gbApp.use(express.static('public'));
gbApp.get('/', (req, res) => {
  res.sendFile(__dirname + "/gb.html", 'utf8', function (err) {
    if (err)
      logger.error("Gamble System page load error:" + err);
  });
})

gbApp.listen(gbConsts.PORT_GB);
logger.debug('ALZK Gamble System URL : http://127.0.0.1:' + gbConsts.PORT_GB);