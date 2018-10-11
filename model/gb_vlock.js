'use strict';

const Promise = require('promise');
const request = require('request');

const logger = require('../gb_logger').logger;
const mUtil = require('./util');
const util = require('../gbUtil');

class VLock {
    constructor (lockInfo) {
        this.macAddr = '';         // lock_mac, primary key
        this.areaType = '';
        this.status = '0';     // 0: inactive 1: running test
        this.cardList = {k0:[],k1:[],k2:[]};
        this.events = [];
        this.settings = {
            e0: {
                battery: '0A90',
                serial : 'TEST_SERIAL',
                temperature : '0A90',
                antenna: '1',
                ssid: '11n.ALZK',
                rssi: '-90'
            },
            e2 : {
                fw : 'TEST_FM',
                model : 'TEST_MODEL',
                serial : 'TEST_SERIAL',
                protocol : 'TEST_PROTOCOL',
                hw : 'TEST_HW',
                date : 'TEST_DATE',
                ps : 'TEST_PS'
            },
            j0:{ volumn:"2", lock:"111", sec:"5", time:"1800" },
            l1:{ interval:"60", time:"4", close:"180" },
            w0:{ mode:'0'}
        };
        if (lockInfo) {
            Object.keys(lockInfo).forEach( (p)=>{
                this[p] = lockInfo[p];
            })
        }
        this.macAddr = this.macAddr.toLowerCase();

        this.runParams = {};
        this.ackCmd = {cmd:'', qObj:{status: "ok"}};
        this.e1Interrupt = false;
        this.currE1 = 0;
    }

    startTest(self, params) {
        self.status='1';
        self.runParams = params;
        logger.debug(self.macAddr+" Starting.............");
        self.sendE0(self).then();
        setTimeout(self.scanCardTimer, params.scanDelay * 1000, self);
    }

    stopTest() {
        this.status='0';
    }

    sendE0(self) {
        return new Promise((resolve, reject)=>{
            if (self.status=='0') reject();
            else {
                const e0LoopStartTime = new Date();
                self.ackCmd.cmd = '';
                self.sendRequest("e0", self.settings.e0, -1)
                .then((httpBody)=>{
                    return self.loopSession(httpBody, -1);
                }).then(()=>{
                    logger.info(self.macAddr+" e0 completed ---------------");
                    return self.sendE3();
                }).then(()=>{
                    if (self.status=='1')
                        setTimeout(self.sendE0, self.runParams["e0Interval"+self.areaType]*1000, self);
                    mUtil.execSimpleSQL(null,`insert into testreports values ( null,
                        '${TESTCASE.testCaseName}','e0',${(new Date())-e0LoopStartTime},
                        'Y','${self.macAddr}','${util.dateToDbStr(new Date())}'
                    )`).done();
                    resolve();
                }).catch((err)=>{
                    if (self.status=='1')
                        setTimeout(self.sendE0, self.runParams["e0Interval"+self.areaType]*1000, self);
                    mUtil.execSimpleSQL(null,`insert into testreports values ( null,
                        '${TESTCASE.testCaseName}','e0',${(new Date())-e0LoopStartTime},
                        'N','${self.macAddr}','${util.dateToDbStr(new Date())}'
                    )`).then();
                    reject(err);
                });
            }
        });
    }

    sendE1(e1Data) {
        const self=this;
        return new Promise((resolve, reject)=>{
            if (self.status=='0') reject();
            else {
                const e1LoopStartTime = new Date();
                e1Data.rtc = util.dateToRtcStr(new Date());
                self.events.push(e1Data.card+"-"+e1Data.rtc+"-"+e1Data.code);
                self.currE1++;
                const myE1 = self.currE1;
                self.sendRequest("e1", e1Data, myE1)
                .then((httpBody)=>{
                    self.e1Interrupt = true;
                    return self.loopSession(httpBody, myE1);
                }).then(()=>{
                    self.currE1=myE1;
                    self.e1Interrupt = false;
                    mUtil.execSimpleSQL(null,`insert into testreports values ( null,
                        '${TESTCASE.testCaseName}','e1',${(new Date())-e1LoopStartTime},
                        'Y','${self.macAddr}','${util.dateToDbStr(new Date())}'
                    )`).done();
                    resolve();
                }).catch((err)=>{
                    mUtil.execSimpleSQL(null,`insert into testreports values ( null,
                        '${TESTCASE.testCaseName}','e1',${(new Date())-e1LoopStartTime},
                        'N','${self.macAddr}','${util.dateToDbStr(new Date())}'
                    )`).then();
                    reject(err);
                });
            }
        });
    }
        
    loopSession(responseBody, e1) {
        const self=this;
        return new Promise((resolve, reject)=>{    
            if (self.status=='0') reject();
            else {
                if (responseBody) {
                    if (responseBody.cmd) {  // need to send Ack request
                        self.processRcvData(responseBody);
                        self.prepareSendData(responseBody);
                        self.sendRequest(self.ackCmd.cmd, self.ackCmd.qObj, e1)
                        .then((res)=>{
                            return self.loopSession(res, e1);
                        }).then(()=>{
                            resolve();
                        }).catch((err)=>{
                            reject(err);
                        })
                    } else { // end the session
                        self.ackCmd = {cmd:'', qObj:{status:"ok"}};
                        resolve();
                    }
                } else {  // server fail to response -- end the session
                    self.ackCmd = {cmd:'', qObj:{status:"ok"}};
                    reject("MF-admin server fail");
                }
            }
        });
    }

    sendE3() {
        const self=this;
        return new Promise((resolve, reject)=>{    
            if (self.status=='0') reject();
            else {
                if (self.events.length == 0)
                    resolve();
                else {
                    var p=new Promise.resolve();
                    const loopEvents = self.events.slice(0);
                    loopEvents.forEach((e)=>{
                        p = p.then(()=>{
                            self.sendRequest("e3", {data:e}, -1)
                            .then((res)=>{
                                if (res.status == "ok") {
                                    self.events.shift();
                                    return Promise.resolve();
                                } else {
                                    logger.error(self.macAddr+" e3 status err:"+res.errortext);
                                    return Promise.reject("e3 error:"+res.errortext);
                                };
                            }).catch((err)=>{
                                logger.error(self.macAddr+" e3 error:"+err);
                                return Promise.reject(err);
                            });
                        });
                    })
                    p.then(()=>{resolve();}).catch((err)=>{reject(err)});
                }
            }
        });
    }

    scanCardTimer(self) {
        return new Promise((resolve, reject)=>{
            if (self.status=='0') reject();
            else {
                self.scanCard()
                .then(()=>{
                    if (self.status=='1')
                        setTimeout(self.scanCardTimer, self.runParams["scanInterval"+self.areaType]*1000, self);
                }).catch((err)=>{
                    if (this.status=='1')
                        setTimeout(self.scanCardTimer, self.runParams["scanInterval"+self.areaType]*1000, self);
                    logger.error(self.macAddr+" scanCardTimer error:"+err);
                })                                              
            }
        });
    }

    scanCard() {
        const self=this;
        return new Promise((resolve, reject)=>{
            if (self.status=='0') reject();
            else {
//            logger.info(self.macAddr+"/Scan Card");
                const k0Low = 0;
                const k0High = self.runParams["k0Percent"+self.areaType];
                const k1Low = k0High;
                const k1High = self.runParams["k1Percent"+self.areaType]+k1Low;
                const k2Low = k1High;
                const k2High = self.runParams["k2Percent"+self.areaType]+k2Low;
                const magicNum = Math.floor(Math.random() * 100);
                if (k0Low <= magicNum && magicNum < k0High) {            // K0
                    if (self.cardList.k0.length > 0) {
                        const k0Idx = Math.floor(Math.random() * self.cardList.k0.length);
                        logger.info(self.macAddr+" K0 card picked: "+self.cardList.k0[k0Idx]);                
                        self.events.push(self.cardList.k0[k0Idx]+"-"+util.dateToRtcStr(new Date())+"-a");
                    }
                    resolve();
                } else if (k1Low <= magicNum && magicNum < k1High) {     // k1
                    if (self.cardList.k1.length > 0) {
                        const k1Idx = Math.floor(Math.random() * self.cardList.k1.length);
                        logger.info(self.macAddr+" K1 card picked: "+self.cardList.k1[k1Idx]);                
                        self.events.push(self.cardList.k1[k1Idx]+"-"+util.dateToRtcStr(new Date())+"-3");
                        self.sendE1({ card: self.cardList.k1[k1Idx], code: '3'})
                        .then(()=>{ resolve();})
                        .catch((err)=>{reject(err);})              
                    } else {
                        resolve();
                    }
                } else if (k2Low <= magicNum && magicNum < k2High) {     // k2
                    if (self.cardList.k2.length > 0) {
                        const k2Idx = Math.floor(Math.random() * self.cardList.k2.length);
                        logger.info(self.macAddr+" K2 card picked: "+self.cardList.k2[k2Idx]);                
                        self.events.push(self.cardList.k2[k2Idx]+"-"+util.dateToRtcStr(new Date())+"-4");
                        self.sendE1({ card: self.cardList.k2[k2Idx], code: '4'})
                        .then(()=>{ resolve();})
                        .catch((err)=>{reject(err);})              
                    } else {
                        resolve();
                    }
                } else { // Non-K
                    logger.info(self.macAddr+" Non-K card picked: "+"aa000123456789");
                    self.events.push("aa00012345689-"+util.dateToRtcStr(new Date())+"-c");
                }
            }
        });
    }
    
    processRcvData(httpBody) {  // set commands
        switch (httpBody.cmd) {
            case 'k0':
            case 'k1':
            case 'k2':
                if (httpBody.index) // first K with index
                     this.cardList[httpBody.cmd] = [];
                else {
                    httpBody.data.forEach((cardId)=>{
                        this.cardList[httpBody.cmd].push(cardId);
                    })
                };
                break;
            case 'l1':
            case 'j0':
            case 'w0': 
                this.settings[httpBody.cmd] = httpBody.data[0];
                break;
            case 'z0': // firmware
                // TO do : download the fireware
                break;
        }
    }

    prepareSendData(httpBody) {
        this.ackCmd.cmd = httpBody.cmd;
        this.ackCmd.status = "ok";
        switch (httpBody.cmd) {
            case 'e2':
                this.ackCmd.data = this.settings.e2;
                break;
            default:
                break;
        }
    }

    sendRequest(cmd, qObj, e1) {
        const self=this;
        return new Promise((resolve, reject)=>{
            if (self.status=='0') reject();
            else {            
                logger.debug(self.macAddr+"/"+cmd+"-----oldE1="+e1+" currE1="+self.currE1+" e1Interrunpt="+self.e1Interrupt+" content="+JSON.stringify(qObj));
                if (e1 >= 0) {  // from e1 session
                    if ( e1 != self.currE1) // new E1 come
                        return reject(`sendRequest ${cmd} interrupt by new e1-----------------`);
                } else {  // from non-e1 session
                    if ( self.e1Interrupt ) // 
                        return reject(`sendRequest ${cmd} interrupt by e1-----------------`);
                }
                logger.info(self.macAddr+" sendRequest:"+cmd);
                const url=`https://${gbConsts.HOST_IP}:${gbConsts.PORT_LOCKAPI}/lockapi/${self.macAddr}/${cmd}`;
                request(
                    {
                        uri: url,
                        method: "GET",
                        timeout: 60*1000,
                        qs: qObj,
                        json: true,
                        rejectUnauthorized: false
                    }, 
                    function(error, response, body) {
                        if (error) {
                            logger.error(self.macAddr+` ${cmd} request error:`+error);
                            reject(cmd+" request error:"+error);
                        } else {
                            if (body.status != "ok") {
                                logger.warn(self.macAddr+` ${cmd} status error:`+body.errortext);
                                reject(cmd+" response status error:"+body.errortext);
                            } else {
                                logger.info(self.macAddr+` http response ${cmd}=`+JSON.stringify(body));
                                resolve(body);
                            }
                        }
                    }
                );
            }
        })        
    }
}

module.exports.VLock = VLock;

