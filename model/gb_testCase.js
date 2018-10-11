'use strict';

const Promise = require('promise');

const logger = require('../alzk_logger').logger;
const mUtil = require('./util');
const util = require('../alzkUtil');

class TestCase {
    constructor (pInfo) {
        this.testCaseName = '';
        this.vLocks = [];
        this.status = 0;  // 0 : stoped 1: running
        this.runParams = {};
        if (pInfo) {
            Object.keys(pInfo).forEach( (p)=>{
                this[p] = pInfo[p];
            })
        }
    }

    start(rParams) {
        this.runParams = rParams;
        if (this.status==1) 
            return;
        else {
            this.vLocks.forEach((v,i)=>{
                VLOCKTIMERS.push(setTimeout(v.startTest, rParams.kickOffInterval*i*1000, v, rParams));
            });
            this.status=1;
            logger.debug("Testcase started !**************************************");            
        }
    }

    stop() {
        this.status=0;
        this.vLocks.forEach((v)=>{
            v.stopTest();
        })
        VLOCKTIMERS.forEach((t)=>{ clearTimeout(t)});
        VLOCKTIMERS = [];
        logger.debug("Testcase stopping **************************************");
    }
}

module.exports.TestCase = TestCase;

