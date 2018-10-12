'use strict';

const mysql = require('mysql');

const logger = require('../gb_logger').logger;
const util = require('./util');
const gbUtil = require('../gbutil');

class Bet {
  constructor(betInfo) {
    this.userid = ''; // userid: kevin3747118
    this.nickname = '';
    this.combimation = '';
    this.bet1 = '';
    this.bet2 = '';
    this.money = '';
    this.totaloddperset = '';
    this.status = 0;
    this.createdate = '';
    if (betInfo) {
      Object.keys(betInfo).forEach((p) => {
        this[p] = betInfo[p];
      })
    }
  }

  saveToDb(conn = null) {
    let self = this;
    return new Promise((resolve, reject) => {
      let sql = `insert into bets (userid, nickname, combination, bet1, bet2, 
                  money, totaloddperset, status, createdate) values (:userid,
                  :nickname, :combination, :bet1, :bet2, :money, :totaloddperset,
                  :status, :createdate)`;
      util.getConn(conn)
        .then((db) => {
          db.query(sql, self, (err, result) => {
            if (!conn) db.release();
            if (err) throw err;
            if (result.affectedRows != 1)
              reject("Login insert error !");
            else
              resolve(self);
          })
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  static statBet(conn = null) {
    return new Promise((resolve, reject) => {
      let sql = ` select userid, nickname, sum(convert(money*totaloddperset, signed)) as money
                  from gamble.bets where status = 3 group by nickname, userid`;
      util.execSimpleSQL(conn, sql, "SEL")
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}

module.exports.Bet = Bet;