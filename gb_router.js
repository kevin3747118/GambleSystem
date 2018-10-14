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

gbRouter.use(function (req, res) {
  res.json(req.response);
});

module.exports = gbRouter;