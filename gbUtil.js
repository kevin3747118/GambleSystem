'use strict';
 
const logger = require('./gb_logger').logger;

const alzkUtil = exports;

alzkUtil.genHexId = function(n, deli) {
    var id='';
    for (var i=0;i<n;++i)
        id += ('00'+Math.floor(Math.random() * 255).toString(16)).substr(-2) + deli
    if (deli == "") 
        return(id.toUpperCase());
    else
        return(id.slice(0,-1).toUpperCase());
}

alzkUtil.dateToRtcStr = function (d) {
    return String('0000'+d.getFullYear()).slice(-4)+
    String('00'+(d.getMonth()+1)).slice(-2)+
    String('00'+d.getDate()).slice(-2)+
    String('00'+d.getHours()).slice(-2)+
    String('00'+d.getMinutes()).slice(-2)+
    String('00'+d.getSeconds()).slice(-2);
}

alzkUtil.dateToDbStr = function (d) {
    return String('0000'+d.getFullYear()).slice(-4)+"/"+
    String('00'+(d.getMonth()+1)).slice(-2)+"/"+
    String('00'+d.getDate()).slice(-2)+" "+
    String('00'+d.getHours()).slice(-2)+":"+
    String('00'+d.getMinutes()).slice(-2)+":"+
    String('00'+d.getSeconds()).slice(-2);
}

alzkUtil.rtcToDbStr = function (d) {
    return d.slice(0,4)+"/"+d.slice(4,6)+"/"+d.slice(6,8)+" "+
        d.slice(8,10)+":"+d.slice(10,12)+":"+d.slice(12,14);
}

alzkUtil.dbDateToRtc = function (d) {
    return d.replace(/[ :\/]/g,'');
}

alzkUtil.isHoliday = function (d) {
    if (d instanceof Date) {
        var qstr = String('0'+ (d.getMonth()+1).toString()).slice(-2)+
                String('0'+d.getDate().toString()).slice(-2);
        if (gbConsts.APP.HOLIDAYS.indexOf(qstr) > -1)
            return true;
    }
    return false;
}

alzkUtil.convertBatteryLevel = function(b) {
    return Math.round((parseInt(b, 16) & 0x0fff)/4096*100);
}

alzkUtil.getTimeControl = function (tcData, flag=0) {
    const now = new Date();
    const tomorrow = new Date(now.setSeconds(now.getSeconds() + 24*60*60));
    const yesterday = new Date(now.setSeconds(now.getSeconds() - 24*60*60));
    const nowHourIdx = now.getHours();
    const nowDayIdx = now.getDay();
    var nextDayIdx = alzkUtil.isHoliday(now) ? 7:now.getDay();
    var prevDayIdx = alzkUtil.isHoliday(now) ? 7:now.getDay();
    var nextHourIdx = nowHourIdx+1;
    var prevHourIdx = nowHourIdx-1;
    if (nextHourIdx == 24) {
        nextHourIdx = 0;
        nextDayIdx = alzkUtil.isHoliday(tomorrow) ? 7:tomorrow.getDay();
    }
    if (prevHourIdx == -1) {
        prevHourIdx = 23;
        prevDayIdx = alzkUtil.isHoliday(yesterday) ? 7:yesterday.getDay();
    }
    switch (flag) {
        case 0: // current
            return tcData[nowDayIdx][nowHourIdx];
        case 1: // next
            return tcData[nextDayIdx][nextHourIdx];
        case -1: // previous
            return tcData[prevDayIdx][prevHourIdx];
    }
}
