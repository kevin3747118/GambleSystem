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
  const fs = require('fs');
  const https = require('https');
  const session = require('client-sessions');
  const gbUtil = require("./gbUtil");
  const Login = require('./model/gb_login').Login;
  const express = require('express'); // call express
  const bodyParser = require('body-parser');
  const gbApp = express();

  gbApp.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });


  gbApp.use(bodyParser.urlencoded({
    extended: true
  }));
  gbApp.use(bodyParser.json());

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

  gbApp.use("/gbApi", function (req, res, next) {
    if (!req[gbConsts.HTTP_SESSION_COOKIENAME].user) {
      // res.redirect("/login.html");
      res.json({
        status: "ERROR",
        errorText: "Please login to do further action"
      })
      // next();
    } else
      next();
  });

  gbApp.get('/', function (req, res) {
    res.redirect("/gb");
  });

  gbApp.get('/gb', function (req, res) {
    res.redirect("/gb.html");
  });

  gbApp.get("/getGames", (req, res, next) => {
    const gameRead = fs.readFileSync(configDir + '/game.json', 'utf8')
    const gameReturn = JSON.stringify(JSON.parse(gameRead));
    res.json({
      status: "ok",
      data: gameReturn
    });
    next()
  })

  gbApp.post('/login', (req, res, next) => {
    req.response = {
      status: ""
    };
    Login.getLoginById(null, req.body._id, true)
      .then((alogin) => {
        if (alogin === null) {
          res.json({
            status: 'NOID'
          });
          next();
        } else {
          gbUtil.comparePassword(req.body.password, alogin.password, (err, match) => {
            if (err) throw err;
            else if (!match) {
              res.json({
                status: "FAIL"
              });
              next()
            } else {
              delete alogin.password;
              res.json({
                status: "SUCCESS",
                redirectUrl: "/gb"
              })
              req[gbConsts.HTTP_SESSION_COOKIENAME].user = alogin;
              next()
              // res.json(req.response);
            }
          })
        }
      })
      .catch((err) => {
        // logger.error("Login error:" + err);
        res.status(500).send('Check Login Error !');
      })
  })

  gbApp.post("/createLogin", (req, res, next) => {
    const newLogin = new Login(req.body);
    Login.getLoginById(null, newLogin._id)
      .then((aLogin) => {
        if (aLogin === null) {
          return newLogin.saveToDb(null, true);
        } else {
          res.json({
            status: "exist"
          });
          throw "exist";
          // next()
        }
      })
      .then((aLogin) => {
        req[gbConsts.HTTP_SESSION_COOKIENAME].user = alogin;
        res.json({
          status: "ok"
        });
        next();
      })
      .catch((err) => {
        if (err != "exist")
          res.json({
            status: "error",
            errorText: err
          });
        next();
      })
  });

  const gbRouter = require("./gb_router");
  gbApp.use('/gbApi', gbRouter);

  const privateKey = fs.readFileSync(configDir + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(configDir + '/cert.pem', 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate,
    passphrase: gbConsts.HTTPS_PASSPHRASE,
    requestCert: false,
    rejectUnauthorized: false
  };
  const httpsServer = https.createServer(credentials, gbApp).listen(gbConsts.PORT_GB, () => {
    logger.debug('Gamble System server listening on port : ' + gbConsts.PORT_GB);
  });
  // gbApp.listen(gbConsts.PORT_GB);
}

function main() {
  setupDBPool();
  startGBServer();
}

main()

// logger.debug('ALZK Gamble System URL : http://127.0.0.1:' + gbConsts.PORT_GB);