'use strict';

const mysql = require('mysql');

const logger = require('./gb_logger').logger;

const Login = require('./model/gb_login').Login;
const Bet = require('./model/gb_bet').Bet;
const Game = require('./model/gb_game').Game;

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

gbRouter.get("/countgameplays", (req, res, next) => {
  //取得每場比賽，投注人數
  Game.countGamePlays()
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
})

gbRouter.get("/insertGameOptions", (req, res, next) => {
  Game.insertGameOption()
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
})

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

gbRouter.post("/sendBets", (req, res, next) => {
  const p = [];
  req.body.forEach((aBet) => {
    const newBet = new Bet(aBet);
    p.push(newBet.saveToDb())
  });
  Promise.all(p)
    .then((res) => {
      req.response = {
        status: "ok",
        data: res
      };
      next()
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: err
      };
      next();
    })
});


// gbRouter.post("/sendBets", (req, res, next) => {
//   const betArr = []
//   req.body.data.forEach((bet) => {
//     const newBet = new Bet(bet);
//     betArr.push(newBet.saveToDb(null))
//   });
//   Promise.all(betArr)
//     .then(() => {
//       req.response = {
//         status: "ok"
//       };
//       next()
//     })
//     .catch((err) => {
//       req.response = {
//         status: "error",
//         errorText: err
//       };
//       next();
//     })
// });


gbRouter.use(function (req, res) {
  res.json(req.response);
});

module.exports = gbRouter;