const mysql = require('mysql');

const logger = require('../gb_logger').logger;

const modelUtil = exports;

modelUtil.getConn = function (conn = null, dbpool = gbConsts.DBPOOL) {
  return new Promise((resolve, reject) => {
    if (conn != null && conn != undefined) resolve(conn);
    else
      dbpool.getConnection(function (err, connection) {
        if (err) reject(err);
        else resolve(connection);
      });
  })
}

modelUtil.execSimpleSQL = function (conn = null, queryStr = "", dml = 'DML', dbpool = gbConsts.DBPOOL) {
  return new Promise((resolve, reject) => {
    if (!conn) {
      modelUtil.getConn(conn, dbpool)
        .then((db) => {
          db.query(queryStr, function (err, result) {
            if (!conn) db.release();
            if (err) {
              logger.error(queryStr);
              logger.error(err);
              reject(err);
            } else if (dml == 'DML') resolve(result.affectedRows);
            else resolve(result);
          });
        }).catch((err) => {
          reject(err);
        });
    } else {
      conn.query(queryStr, (err, result) => {
        if (err) {
          logger.error(queryStr);
          logger.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    }
  })
}

modelUtil.execInsertSQL = function (conn = null, queryStr = "", parms = null) {
  return new Promise((resolve, reject) => {
    conn.query(queryStr, parms, (err, result) => {
      if (err) {
        conn.release();
        logger.error(queryStr);
        logger.error(err);
        reject(err);
      } else {
        resolve(result)
      }
    })
  })
}