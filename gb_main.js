process.on('uncaughtException', (err) => {
  console.error('whoops! there was an error:' + err);
});

// process.setMaxListeners(50);

gbConsts = {}; // global variable
configDir = './.gbConfig';
logDir = './log';
// otaDir = './ota_download';

const logger = require('./gb_logger').logger;
// const winston = require('winston');
const mysql = require('mysql');
// const util = require('./gbUtil');
// const TestCase = require('./model/alzk_testCase').TestCase;


gbConsts = require(configDir + '/gbConfig.json');

function setupDBPool() {
  try {
    gbConsts.DBPOOL = mysql.createPool({
      connectionLimit: gbConsts.DBPOOL_MAX,
      host: gbConsts.HOST_IP,
      port: gbConsts.GB_DB_PORT,
      user: gbConsts.GB_DB_USER,
      password: gbConsts.GB_DB_PWD,
      database: gbConsts.GB_DB_NAME,
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
    logger.error("gb database conn pool init fail:" + err);
    process.exit(-1);
  };
}



function startGBServer() {
  // const https = require('https');
  const session = require('client-sessions');
  const gbUtil = require("./gbUtil");
  const Login = require('./model/gb_login').Login;
  const express = require('express'); // call express
  const bodyParser = require('body-parser');
  const gbApp = express();

  gbApp.use(bodyParser.urlencoded({
    extended: true
  }));
  gbApp.use(bodyParser.json());

  // start router
  const gbRouter = require("./gb_router");
  gbApp.use('/gbApi', gbRouter);

  gbApp.use(express.static('public'));

  gbApp.use(session({
    cookieName: gbConsts.HTTP_SESSION_COOKIENAME,
    secret: gbConsts.HTTP_SESSION_SECRET,
    duration: gbConsts.HTTP_SESSION_DURATION,
    activeDuration: gbConsts.HTTP_SESSION_ACTIVE_DURATION,
    httpOnly: true,
    secure: false,
    ephemeral: true
  }));

  // gb.use("/adm", function (req, res, next) {
  //   if (!req[alzkConsts.HTTP_SESSION_COOKIENAME].user)
  //     res.redirect("/login.html");
  //   else
  //     next();
  // });

  // begin of gamble system

  gbApp.get('/', (req, res) => {
    res.sendFile(__dirname + "/gb.html", 'utf8', function (err) {
      if (err)
        logger.error("Gamble System page load error:" + err);
    });
  })

  gbApp.post('/login', (req, res) => {
    req.response = {
      status: ""
    };
    Login.getLoginById(null, req.body._id, true)
      .then((alogin) => {
        if (alogin === null) {
          req.response = {
            status: 'NOID'
          };
          next();
        } else {
          gbUtil.comparePassword(req.body.password, alogin.password, (err, match) => {
            if (err) throw err;
            else if (!match) {
              req.response = {
                status: "FAIL"
              };
              next();
            } else {
              delete alogin.password;
              req.response = {
                status: "SUCCESS"
              }
              req[gbConsts.HTTP_SESSION_COOKIENAME].user = alogin;
              res.json(req.response);
            }
          })
        }
      })
      .catch((err) => {
        // logger.error("Login error:" + err);
        res.status(500).send('Check Login Error !');
      })
  })

  gbApp.listen(gbConsts.PORT_GB);
}

function main() {
  setupDBPool();
  startGBServer();
}

main()

logger.debug('ALZK Gamble System URL : http://127.0.0.1:' + gbConsts.PORT_GB);