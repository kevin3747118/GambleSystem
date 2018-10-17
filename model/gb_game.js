'use strict';

const mysql = require('mysql');

const logger = require('../gb_logger').logger;
const util = require('./util');
const gbUtil = require('../gbutil');
const game = require('../.gbConfig/game2.json')

class Game {
  // constructor(betInfo) {
  //   this.betid = '';
  //   this.usrid = ''; // userid: kevin3747118
  //   this.combimation = '';
  //   this.money = '';
  //   this.odd = '';
  //   this.userBetOption = ''
  //   this.createdate = gbUtil.dateToDbStr(new Date());
  //   if (betInfo) {
  //     Object.keys(betInfo).forEach((p) => {
  //       this[p] = betInfo[p];
  //     })
  //   }
  // }
  static insertGameOption(conn = null) {
    return new Promise((resolve, reject) => {
      util.getConn(conn)
        .then((db) => {
          const p = [];
          let sql = `INSERT INTO tiger_game_option 
                      (optid, gameid, optname, optodd, optmsg, status, createdate)
                      VALUES (:optid, :gameid, :optname, :optodd, :optmsg, :status, :createdate)`
          game.forEach((ele) => {
            ele.option.forEach((option) => {
              let parms = {
                optid: option.optid,
                gameid: option.gameid,
                optname: option.optname,
                optmsg: option.optmsg,
                optodd: option.optodd,
                status: 0,
                createdate: gbUtil.dateToDbStr(new Date())
              };
              p.push(util.execInsertSQL(db, sql, parms))
            })
          });
          return Promise.all(p)
        })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static countGamePlays(conn = null) {
    return new Promise((resolve, reject) => {
      let sql = `select b.gameid, count(1) as count
      from gamble.tiger_user_bet_option a
      left join gamble.tiger_game_option b on a.optid = b.optid
      group by b.gameid`;
      util.execSimpleSQL(conn, sql, "SEL")
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports.Game = Game;