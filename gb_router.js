'use strict';

const mysql = require('mysql');

const logger = require('./gb_logger').logger;
const util = require('./gbUtil');
const express = require('express');
const querystring = require('querystring');
const mUtil = require('./model/util');

const fs = require("fs");

const gbRouter = express.Router();

gbRouter.use(function (req, res, next) {
  req.response = {
    status: "ok",
    errorText: ""
  }; // init the response
  next();
})

// simuRouter.get("/getTestCaseInfo", function(req,res,next) {
//     next();
// })

// simuRouter.get("/setupTestCase", function(req,res,next) {
//     const vLockCount = req.query.vLockCountG+req.query.vLockCountP+req.query.vLockCountU
//     if (req.query.testCaseName=='' || req.query.vLockCountG<=0 
//         || req.query.vLockCountP<=0 || req.query.vLockCountU<=0) {
//         req.response.status = "error";
//         req.response.errorText = "Invalid parameters!";
//         next();
//     } else {
//         mUtil.execSimpleSQL(null,`select count(*) cnt from vlocks where testcasename='${req.query.testCaseName}'`, "SEL")
//         .then((rows)=>{
//             if (rows[0].cnt > 0)
//                 return Promise.reject("Test Case Name in use, try another one!");
//             return mUtil.execSimpleSQL(null,`update vlocks set testcasename='${req.query.testCaseName}' where testcasename=''`);
//         }).then(()=>{
//             return mUtil.execSimpleSQL(null, `select * from vlocks where testcasename='${req.query.testCaseName}'`, "SEL");
//         }).then((vLocks)=>{
//             if (vLocks.length < req.query.vLockCount) {
//                 req.response.status = "error";
//                 req.response.errorText = "Not enough Virtual Locks, only "+vLocks.length+" available !";
//                 return Promise.resolve();
//             } else {
//                 const p=[];
//                 TESTCASE.vLocks = [];
//                 vLocks.forEach((v)=> {
//                     if (TESTCASE.vLocks.length < req.query.vLockCount) {
//                         TESTCASE.vLocks.push(new VLock({
//                             macAddr : v.macaddr,
//                             areaType : v.areatype,
//                             status : v.status,
//                             cardList : v.cardlist,
//                             events : v.events,
//                             settings : v.settings,
//                             testCaseName : v.testcasename
//                         }));
//                     } else {
//                         p.push(mUtil.execSimpleSQL(null, `update vlocks set testcasename='' where macaddr='${v.macaddr}'`));
//                     }
//                 })
//                 return Promise.all(p);
//             }
//         }).then(()=>{
//             TESTCASE.testCaseName = req.query.testCaseName;
//             next();
//         }).catch((err)=>{
//             req.response.status = "error";
//             req.response.errorText= JSON.stringify(err);
//             next()
//         })        
//     }
// })

gbRouter.get("/getGames", (req, res, next) => {
  const gameRead = fs.readFileSync('./game.json', 'utf8')
  const gameReturn = JSON.stringify(JSON.parse(gameRead));
  req.response = {
    status: "ok",
    data: gameReturn
  };
  next()
})

// simuRouter.get("/startTest", function (req, res, next) {
//   const runParams = {};
//   runParams.scanDelay = parseInt(req.query.scanDelay);
//   runParams.kickOffInterval = parseInt(req.query.kickOffInterval);
//   ['R', 'G', 'P', 'U'].forEach((t) => {
//     var qt = t;
//     if (t == 'R')
//       qt = 'G';
//     runParams["e0Interval" + t] = parseInt(req.query["e0Interval" + qt]);
//     runParams["scanInterval" + t] = parseInt(req.query["scanInterval" + qt]);
//     runParams["k0Percent" + t] = parseInt(req.query["k0Percent" + qt]);
//     runParams["k1Percent" + t] = parseInt(req.query["k1Percent" + qt]);
//     runParams["k2Percent" + t] = parseInt(req.query["k2Percent" + qt]);
//   });
//   mUtil.execSimpleSQL(null, `delete from testreports where testcasename='${TESTCASE.testCaseName}'`)
//     .then(() => {
//       TESTCASE.start(runParams);
//       logger.info("Test startup ok !");
//       next();
//     }).catch((err) => {
//       req.response.status = "error";
//       req.response.errorText = err;
//       next();
//     })
// })

// simuRouter.get("/stopTest", function (req, res, next) {
//   TESTCASE.stop();
//   next();
// })

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

// simuRouter.get("/getTestReport", function (req, res, next) {
//   req.response.totalVLocks = TESTCASE.vLocks.length;
//   req.response.runParams = TESTCASE.runParams;
//   req.response.totalInterruptSessions = 0;
//   req.response.totalCompleteSessions = 0;
//   req.response.totalTime = 0;
//   mUtil.execSimpleSQL(null, `select sessiontime from testreports 
//         where testcasename='${TESTCASE.testCaseName}'`, "SEL")
//     .then((sessionInfos) => {
//       sessionInfos.forEach((s) => {
//         if (s.completed == 'N')
//           req.response.totalInterruptSessions++;
//         else
//           req.response.totalCompleteSessions++;
//         req.response.totalTime += s.sessiontime;
//       });
//       next();
//     }).catch((err) => {
//       req.response.status = "error";
//       req.response.errorText = err;
//       next();
//     })
// });

// simuRouter.get("/getAvailableVLocks", function (req, res, next) {
//   mUtil.execSimpleSQL(null, `select count(*) cnt from vlocks 
//         where testcasename=''`, "SEL")
//     .then((cnts) => {
//       req.response.vLockCount = cnts[0].cnt;
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