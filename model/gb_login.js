'use strict';

const mysql = require('mysql');

const logger = require('../gb_logger').logger;
const util = require('./util');
const gbUtil = require('../gbutil');

class Login {
  constructor(loginInfo) {
    this._id = ''; // must specify
    this.nickname = '';
    this.email = '';
    this.password = '';
    // this.funcPrivilege = [];
    // this.userPref = {
    //   AREATREE_WIDTH: 8
    // };
    if (loginInfo) {
      Object.keys(loginInfo).forEach((p) => {
        this[p] = loginInfo[p];
      })
    }
  }

  saveToDb(conn = null, pwd = false) {
    let self = this;
    return new Promise((resolve, reject) => {
      if (pwd == true) {
        let sql = `replace logins set _id=:_id,
                nickname=:nickname, 
                email=:email,
                password=:password`;
        gbUtil.encryptPassword(self.password, (err, hash) => {
          if (err) reject(err);
          else {
            self.password = hash;
            util.getConn(conn)
              .then((db) => {
                db.query(sql, self, function (err, result) {
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
              });
          }
        })
      } else {
        let sql = `update logins set 
                name=:name, email=:email
                where _id=:_id`;
        delete self.password;
        util.getConn(conn)
          .then((db) => {
            db.query(sql, self, function (err, result) {
              if (!conn) db.release();
              if (err) throw err;
              if (result.affectedRows != 1)
                reject("Data Not Found !");
              else
                resolve(self);
            })
          }).catch((err) => {
            reject(err);
          });
      }
    })
  }

  static getLoginById(conn = null, id = '', pwd = false) {
    return new Promise((resolve, reject) => {
      util.getConn(conn)
        .then((db) => {
          db.query("select * from logins where _id=:id", {
            id: id
          }, (err, rows) => {
            if (!conn) db.release();
            if (err) throw err;
            else {
              if (rows.length == 0) resolve(null);
              else {
                let aLogin = new Login({
                  _id: rows[0]._id,
                  nickname: rows[0].nickname,
                  email: rows[0].email,
                  password: rows[0].password
                });
                if (!pwd)
                  delete aLogin.password;
                resolve(aLogin);
              }
            }
          });
        }).catch((err) => {
          reject(err);
        })
    })
  }
}

module.exports.Login = Login;