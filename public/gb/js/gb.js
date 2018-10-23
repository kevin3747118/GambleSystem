(function ($) {
    $.fn.showLoader = function () {
        this.append($('<div></div>').addClass('lds-hourglass'));
    };
    $.fn.hideLoader = function () {
        this.find("[class='lds-hourglass']").remove();
    };
    String.format = function () {
        let s = arguments[0];
        for (let i = 0; i < arguments.length - 1; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    };
    String.prototype.replaceAll = function (regex, value) {
        var obj = this;
        return obj.replace(new RegExp(regex, 'gm'), value);
    };
    String.prototype.toFloat = function () {
        return parseFloat(this) || 0;
    };
}(jQuery));

function GetUser() {
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    return user;
};

function gsTask(callback, seconds) {
    callback();
    return setInterval(callback, seconds * 1000);
};

function gsGet(param, callback) {
    $.get(param['url'], { data: param['data'] },
        function (data, status) {
            if (status === "success") {
                if (data.status === 'ok') {
                    let json = (!Array.isArray(data.data)) ? JSON.parse(data.data) : data.data;
                    if (typeof callback === 'function') {
                        callback(json);
                    } else {
                        return json;
                    }
                } else {
                    // alert("");
                }
            }
        }
    );
};

function gsPost(param, callback) {
    $.post(param['url'], { data: '' },
        function (data, status) {
            if (status === "success") {
                if (data.status === 'ok') {
                    let json = JSON.parse(data.data);
                    if (typeof callback === 'function') {
                        callback(json);
                    } else {
                        return json;
                    }
                } else {
                    // alert("");
                }
            }
        }
    );
};

//載入game
loadGame = () => {
    $('#index-gamelist').showLoader();
    let param = {};
    param['url'] = '/getGames';
    gsGet(param, (games) => {
        if (Array.isArray(games)) {

            if (games[0].gameinfo.away.playerprofile['name'] === 'TBD') {
                $('.gb-playerprofile .gb-away').find('strong').empty().append(games[0].gameinfo.away.playerprofile['name']);
            }
            else {
                let record = games[0].gameinfo.away.playerprofile['name'] + '<br/>' + games[0].gameinfo.away.playerprofile['record'];
                $('.gb-playerprofile .gb-away').find('img').attr('src', games[0].gameinfo.away.playerprofile['pic']);
                $('.gb-playerprofile .gb-away').find('strong').empty().append(record);
                $('.gb-playerprofile .gb-away').find('span').empty().append(games[0].gameinfo.away.playerprofile['quote']);
                $('.gb-playerprofile .gb-away').click(function () { window.open(games[0].gameinfo.away.playerprofile['data'], '_target'); });
                $('.gb-playerprofile .gb-away').css({ "cursor": "pointer" });
            }

            if (games[0].gameinfo.home.playerprofile['name'] === 'TBD') {
                $('.gb-playerprofile .gb-home').find('strong').empty().append(games[0].gameinfo.home.playerprofile['name']);
            }
            else {
                let record = games[0].gameinfo.home.playerprofile['name'] + '<br/>' + games[0].gameinfo.home.playerprofile['record'];
                $('.gb-playerprofile .gb-home').find('img').attr('src', games[0].gameinfo.home.playerprofile['pic']);
                $('.gb-playerprofile .gb-home').find('strong').empty().append(record);
                $('.gb-playerprofile .gb-home').find('span').empty().append(games[0].gameinfo.home.playerprofile['quote']);
                $('.gb-playerprofile .gb-home').click(() => { window.open(games[0].gameinfo.home.playerprofile['data'], '_target'); });
                $('.gb-playerprofile .gb-home').css({ "cursor": "pointer" });
            }

            let outerHtml =
                `<div class="row mb-3">
    <div class="col-md-12">
      <div class="card shadow-sm" data-gameid="{gameid}" data-gamename="{gamename}">
        <div class="card-footer">
          <strong class="text-primary">{gamename}</strong>
          <span style="float: right;"><span>
        </div>
        {optionhtml}
      </div>
    </div>
</div>`;
            let innerHtml =
                `<div class="card-body border-top border-bottom h-md-100" data-optid="{optid}" data-gameid="{gameid}" data-optname="{optname}" data-optodd="{optodd}">
    <div class="gb-card-team">{optname}</div>
        <div>{optmsg}</div>
        <span class="gb-card-user"></span>
        <h5 style="text-align: right">{optodd}</h5>
</div>`;

            try {
                $.each(games, (idx, game) => {
                    let gamename = (game['gamedate']) ? '' : (game['gamedate'] + '&nbsp;');
                    gamename += game['gamename'];
                    let outer = outerHtml.replaceAll('{gameid}', game['gameid']);
                    outer = outer.replaceAll('{gamename}', game['gamename']);
                    let inner = '';
                    $.each(game['option'], (idx, option) => {
                        let opt = innerHtml.replaceAll('{optid}', option['optid']);
                        opt = opt.replaceAll('{gameid}', option['gameid']);
                        opt = opt.replaceAll('{optname}', option['optname']);
                        opt = opt.replaceAll('{optodd}', option['optodd']);
                        opt = opt.replaceAll('{optmsg}', option['optmsg']);
                        // opt = opt.replaceAll('{option}', JSON.stringify(option).replaceAll());
                        inner += opt;
                    });
                    outer = outer.replaceAll('{optionhtml}', inner);
                    $('#index-gamelist').append(outer);
                });
                //
                $('#index-gamelist .card-body').click(selectGame);
                $('#index-aside input[name="combination"]').click(selectCombination);
                gsTask(() => {
                    $.get('/countgames', {},
                        (data, status) => {
                            if (status === "success") {
                                if (data.status === 'ok') {
                                    let json = {};
                                    $.each(data.data, function (idx, item) {
                                        json[item['gameid']] = item["count"];
                                    });
                                    let games = $('div.card[data-gameid]');
                                    $.each(games, function (idx, game) {
                                        let gameid = $(game).attr('data-gameid');
                                        if (json[gameid] == null || json[gameid] == '')
                                            $(game).find('.card-footer span').empty().append('已投注人數:&nbsp;0&nbsp;人');
                                        else
                                            $(game).find('.card-footer span').empty().append('已投注人數:&nbsp;' + json[gameid] + '&nbsp;人');
                                    });
                                }
                            }
                        }
                    );
                }, 5);
                gsTask(betstatus, 5);
                // {"status":"ok","data":[{"gameid":"G10","count":3},{"gameid":"G100","count":2},{"gameid":"G20","count":3},{"gameid":"G50","count":1}]}
                $('#index-gamelist').hideLoader();
            } catch {
            }
        }
    });
};

function betstatus() {
    $.get('/getbetstatus', {},
        (data, status) => {
            if (status === "success") {
                if (data.status === 'ok') {
                    Object.keys(data.data).forEach((key) => {
                        let userid = '';
                        data.data[key].forEach((user) => {
                            userid += ((user['nickname'] === '') ? '' : user['nickname']) + ' ' + '($' + user['money'] + '), ';
                        });
                        userid = userid.trim();
                        userid = userid.substring(0, userid.length - 1);
                        $('div.card-body[data-optid="' + key + '"]').find('span.gb-card-user').html(userid);
                    });
                }
            }
        }
    );
};

function selectGame() {
    //
    let x = $(event.target);
    x = (x.hasClass('card-body')) ? x : x.parent('.card-body');
    let p = x.parent('.card');
    let gameid = p.attr('data-gameid');
    let gamename = p.attr('data-gamename');
    let optid = x.attr('data-optid');
    if (x.hasClass('bg-warning')) {
        $('li.game[data-gameid="' + gameid + '"]').remove();
        let list = $('#index-aside li');
        if (list.length === 8) //init: 8
        {
            $(list[5]).show(); //hide empty
        }
        $(x).removeClass('bg-warning');
        setMoney();
    } else {
        x.addClass('bg-warning');
        // let option = JSON.parse(x.attr('data-option'));
        let optodd = x.attr('data-optodd');
        let optname = x.attr('data-optname');

        $('div.card-body[data-gameid="' + gameid + '"][data-optid!="' + optid + '"]').removeClass('bg-warning');
        //
        let combination = $('#index-aside input[name="combination"]:checked').val();
        let outerHtml = `<li class="list-group-item game" data-optid="{0}" data-gameid="{1}"></li>`;
        let innerHtml = `
    <input type="hidden" name="optid" value="{optid}"/>
    <input type="hidden" name="optodd" value="{optodd}"/>
    <strong>{optname}&nbsp;({optodd})</strong><br>
    <small>{gamename}</small>
    <div class="game-money" {display}><input type="text" name="money" placeholder="本金" /><span>可贏得 0 元</span></div>`;
        outerHtml = String.format(outerHtml, optid, gameid);
        innerHtml = innerHtml.replaceAll('{optid}', optid);
        innerHtml = innerHtml.replaceAll('{optodd}', optodd);
        innerHtml = innerHtml.replaceAll('{optname}', optname);
        innerHtml = innerHtml.replaceAll('{gamename}', gamename);
        innerHtml = innerHtml.replaceAll('{display}', (combination === '1') ? '' : 'style="display:none;"');
        //       
        let list = $('#index-aside li');
        $(list[5]).hide(); //hide empty
        if (list.length > 9) //init: 8
        {
            let add = false;
            let len = list.length - 8;
            for (i = 0; i < len; i++) {
                if ($(list[i + 6]).attr('data-gameid') === gameid) {
                    $(list[i + 6]).empty().append(innerHtml);
                    add = true;
                }
            }
            if (!add) {
                $(list[len + 3]).after($(outerHtml).append(innerHtml));
            }
        }
        else {
            $(list[3]).after($(outerHtml).append(innerHtml));
        }
    }
    //
    $('input[name="money"]').on('keyup', setMoney);
    setMoney();
};

function selectCombination() {
    let list = $('#index-aside li');
    if (this.value === '1') { //單場
        $(list.get(list.length - 4)).hide();
        $(list.find('.game-money')).show();
    } else { //過關
        $(list.get(list.length - 4)).show();
        $(list.find('.game-money')).hide();
    }
    setMoney();
};

function setMoney() {
    let moneys = 0; //總投注
    let earns = 0; //總贏得
    let odds = 0; //總賠率
    let combination = $('#index-aside input[name="combination"]:checked').val();
    if (combination === '1') {
        let games = $('#index-aside li.game');
        $.each(games, function (idx, game) {
            let odd = $(game).find('input[name="optodd"]').val();
            let money = $(game).find('input[name="money"]').val();
            let earn = parseInt(odd.toFloat() * money.toFloat());
            $(game).find('.game-money span').empty().append('可贏得 ' + earn + ' 元');
            moneys += money.toFloat();
            earns += earn;
        });
    } else {
        let group = $('#index-aside li.group');
        let games = $('#index-aside li.game');
        $.each(games, function (idx, game) {
            let odd = $(game).find('input[name="optodd"]').val();
            if (odds === 0)
                odds = odd;
            else
                odds *= odd.toFloat();
        });
        odds = odds.toFixed(2); //四捨五入
        moneys = $(group).find('input[name="money"]').val();
        earns = parseInt(odds * moneys.toFloat());
        $(group).find('input[name="odd"]').val(odds);
        $(group).find('.group-odd').empty().append('過關賠率 ' + odds);
        $(group).find('.group-money span').empty().append('可贏得 ' + earns + ' 元');
    }
    $('#index-aside li.gs-moneys').empty().append('投注總金額 ' + moneys + ' 元');
    $('#index-aside li.gs-earns').empty().append('最高可贏 ' + earns + ' 元');
};