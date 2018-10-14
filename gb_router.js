'use strict';

const mysql = require('mysql');

const logger = require('./gb_logger').logger;

const Login = require('./model/gb_login').Login;
const Bet = require('./model/gb_bet').Bet;

const util = require('./gbUtil');
const express = require('express');
const querystring = require('querystring');
const mUtil = require('./model/util');
const gbUtil = require('./gbutil');

const fs = require("fs");

const gbRouter = express.Router();

gbRouter.use(function (req, res, next) {
  req.response = {
    status: "ok",
    errorText: ""
  }; // init the response
  next();
})

gbRouter.post("/deleteBet", (req, res, next) => {
  const deleteId = req.body;
  newBet.deleteBet(null, deleteId)
    .then(() => {
      req.response = {
        status: "ok"
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: err
      };
      next();
    })
});

gbRouter.post("/getPersonalBet", (req, res, next) => {
  Bet.getPersonalBet(null, req.body)
    .then((res) => {
      req.response = {
        status: "ok",
        data: res
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: err
      };
      next();
    })
});


gbRouter.get("/statBets", (req, res, next) => {
  Bet.statBet(null)
    .then((res) => {
      req.response = {
        status: "ok",
        data: res
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: err
      };
      next();
    })
});

gbRouter.post("/sendBet", (req, res, next) => {
  const newBet = new Bet(req.body);
  newBet.saveToDb(null)
    .then((aBet) => {
      req.response = {
        status: "ok"
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: err
      };
      next();
    })
});


gbRouter.get("/getGames", (req, res, next) => {
  const gameRead = fs.readFileSync(configDir + '/game.json', 'utf8')
  const gameReturn = JSON.stringify(JSON.parse(gameRead));
  req.response = {
    status: "ok",
    data: gameReturn
  };
  next()
})

gbRouter.post('/login', (req, res, next) => {
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
            next()
          } else {
            delete alogin.password;
            req.response = {
              status: "SUCCESS",
              redirectUrl: "/gb"
            }
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

gbRouter.post("/createLogin", (req, res, next) => {
  const newLogin = new Login(req.body);
  Login.getLoginById(null, newLogin._id)
    .then((aLogin) => {
      if (aLogin === null) {
        return newLogin.saveToDb(null, true);
      } else {
        req.response = {
          status: "exist"
        };
        throw "exist";
        // next()
      }
    })
    .then((aLogin) => {
      req[gbConsts.HTTP_SESSION_COOKIENAME].user = alogin;
      req.response = {
        status: "ok"
      };
      next();
    })
    .catch((err) => {
      if (err != "exist")
        req.response = {
          status: "error",
          errorText: err
        };
      next();
    })
});

// simuRouter.get("/relinkVLocks", function (req, res, next) {
//   const lockSettings = {
//     j0: {
//       volumn: "2",
//       lock: "111",
//       sec: "5",
//       time: "1800"
//     },
//     l1: {
//       interval: "60",
//       time: "4",
//       close: "180"
//     },
//     w0: {
//       mode: '0'
//     }
//   };
//   const p = [];
//   mUtil.execSimpleSQL(null, `select * from vlocks where testcasename='${TESTCASE.testCaseName}'`, "SEL")
//     .then((vLocks) => {
//       vLocks.forEach((v) => {
//         p.push(mUtil.execSimpleSQL(null, "update lockplaces set " +
//           "locksettings=" + mysql.escape(JSON.stringify(lockSettings)) +
//           `,lastkeyids='["0"]', lastinsids='["0"]', lastdelids='["0"]'` +
//           " where lockid=" + mysql.escape(v.macaddr), "DML", gbConsts.DBPOOL));
//         p.push(mUtil.execSimpleSQL(null, `update lockcommands set 
//                 status=1 where lockplaceid=(select _id from lockplaces where lockid='${v.macaddr}')
//                 and cmd in ('j0','l1','w0','e0')`, "DML", gbConsts.DBPOOL));
//       });
//       return Promise.all(p);
//     }).then(() => {
//       next();
//     }).catch((err) => {
//       req.response.status = "error";
//       req.response.errorText = err;
//       next();
//     })
// });

gbRouter.use(function (req, res) {
  res.json(req.response);
});

module.exports = gbRouter;