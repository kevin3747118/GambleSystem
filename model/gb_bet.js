'use strict';

const mysql = require('mysql');

const logger = require('../gb_logger').logger;
const util = require('./util');
const gbUtil = require('../gbutil');

class Bet {
  constructor(betInfo) {
    this.betid = '';
    this.usrid = ''; // userid: kevin3747118
    this.combimation = '';
    this.money = '';
    this.odd = '';
    this.userBetOption = ''
    this.createdate = gbUtil.dateToDbStr(new Date());
    if (betInfo) {
      Object.keys(betInfo).forEach((p) => {
        this[p] = betInfo[p];
      })
    }
  }

  saveToDb(conn = null) {
    let self = this;
    return new Promise((resolve, reject) => {
      util.getConn(conn)
        .then((db) => {
          db.beginTransaction((err) => {
            if (err) {
              db.release();
              reject(err);
            } else {
              let sql = `insert into tiger_user_bet (usrid, combination, money, odd, createdate) 
                          values (:usrid, :combination, :money, :odd, :createdate)`;
              util.execInsertSQL(db, sql, self)
                .then((res) => {
                  let sql = `select max(betid) as betid from tiger_user_bet`;
                  return util.execSimpleSQL(db, sql)
                })
                .then((betid) => {
                  self.betid = betid[0].betid
                  const p = [];
                  self.userBetOption.forEach((optid) => {
                    let parms = {
                      betid: self.betid,
                      optid: optid.optid,
                      createdate: self.createdate
                    }
                    p.push(this.tigerUserBet(db, parms))
                  })
                  return Promise.all(p);
                })
                .then(() => {
                  db.commit((err) => {
                    if (err) {
                      db.rollback();
                      db.release();
                      reject(err);
                    } else {
                      db.release();
                      resolve({
                        betid: self.betid
                      }); //
                    }
                  })
                })
                .catch((err) => {
                  db.rollback();
                  db.release();
                  reject(err);
                })
            }
          })
        })
        .catch((err) => {
          db.rollback();
          db.release();
          reject(err);
        })
    })
  }

  tigerUserBet(conn = null, parms) {
    let self = this;
    return new Promise((resolve, reject) => {
      let sql = `insert into tiger_user_bet_option (betid, optid, createdate) values (:betid, :optid, :createdate)`;
      conn.query(sql, parms, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  static deleteBet(conn = null, deleteId) {
    return new Promise((resolve, reject) => {
      let sql = `delete from bets where _id = :_id`;
      util.getConn(conn)
        .then((db) => {
          db.query(sql, deleteId, (err, result) => {
            if (!conn) db.release();
            if (err) throw err;
            if (result.affectedRows != 1)
              reject("Delete a bet error !");
            else
              resolve();
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static statBet(conn = null) {
    return new Promise((resolve, reject) => {
      // let sql = ` select userid, nickname, sum(convert(money*totaloddperset, signed)) as money
      //             from bets where status = 3 group by nickname, userid`;
      let sql = `select a._id, a.nickname, b.win from gamble.logins a join (select userid, sum(convert(money*odd, signed)) as win
      from gamble.tiger_user_bet where betid in (
      select distinct betid from gamble.tiger_user_bet_option where optid in (
      select optid from gamble.tiger_game_option where status = 1))
      group by userid) b on a._id = b.userid`
      util.execSimpleSQL(conn, sql, "SEL")
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err);
        })
    })
  }

  static getPersonalBet(conn = null, id) {
    return new Promise((resolve, reject) => {
      let sql = `select a._id, a.nickname, b.win from gamble.logins a join (select userid, sum(convert(money*odd, signed)) as win
      from gamble.tiger_user_bet where betid in (
      select distinct betid from gamble.tiger_user_bet_option where optid in (
      select optid from gamble.tiger_game_option where status = 1))
      group by userid) b on a._id = b.userid`;
      util.getConn(conn)
        .then((db) => {
          db.query(sql, id, (err, result) => {
            if (!conn) db.release();
            if (err) throw err;
            // if (result.affectedRows != 1)
            //   reject("Get personal bet error !");
            else
              resolve(result);
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports.Bet = Bet;