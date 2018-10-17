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

function loadGame() {
    $('#index-gamelist').showLoader();
    let param = {};
    param['url'] = '/getGames';
    gsGet(param, function (games) {
        if (Array.isArray(games)) {
            //             let html =
            //                 `<div class="row mb-3">
            //     <div class="col-md-12">
            //       <div class="card shadow-sm" data-gameid="{gameid}">
            //         <div class="card-footer">
            //           <strong class="text-primary">{gamedate}{gamename}</strong>
            //         </div>
            //         <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-optid="">
            //           <div class="gb-card-team">{optname}</div>
            //           <div>{a-pitcher} ({a-state}, {a-era})</div>
            //           <h5 style="text-align: right">{a-odd}</h5>
            //         </div>
            //         <div class="card-body h-md-100" data-gameid="{gameid}" data-optid="">
            //         <div class="gb-card-team">{optname}</div>
            //         <div>{h-pitcher} ({h-state}, {h-era})</div>
            //         <h5 style="text-align: right">{h-odd}</h5>
            //         </div>
            //       </div>
            //     </div>
            // </div>`;

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
        <h5 style="text-align: right">{optodd}</h5>
</div>`;

            try {
                $.each(games, function (idx, game) {
                    let gamename = (game['gamedate']) ? '' : (game['gamedate'] + '&nbsp;');
                    gamename += game['gamename'];
                    let outer = outerHtml.replaceAll('{gameid}', game['gameid']);
                    outer = outer.replaceAll('{gamename}', game['gamename']);
                    let inner = '';
                    $.each(game['option'], function (idx, option) {
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
                // Object.keys(data).forEach(function eachKey(gameid) {
                //     let game = html.replaceAll('{gameid}', gameid);
                //     game = game.replaceAll('{gamedate}', data[gameid]['gamedate']);
                //     game = game.replaceAll('{a}', data[gameid]['game']['a']);
                //     game = game.replaceAll('{h}', data[gameid]['game']['h']);
                //     game = game.replaceAll('{a-team}', data[gameid]['game']['a'][0]);
                //     game = game.replaceAll('{a-pitcher}', data[gameid]['competitors']['a'][0]);
                //     game = game.replaceAll('{a-state}', data[gameid]['competitors']['a'][1]);
                //     game = game.replaceAll('{a-era}', data[gameid]['competitors']['a'][2]);
                //     game = game.replaceAll('{a-odd}', data[gameid]['game']['a'][2]);
                //     game = game.replaceAll('{h-team}', data[gameid]['game']['h'][0]);
                //     game = game.replaceAll('{h-pitcher}', data[gameid]['competitors']['h'][0]);
                //     game = game.replaceAll('{h-state}', data[gameid]['competitors']['h'][1]);
                //     game = game.replaceAll('{h-era}', data[gameid]['competitors']['h'][2]);
                //     game = game.replaceAll('{h-odd}', data[gameid]['game']['h'][2]);
                //     $('#index-gamelist').append(game);
                // });
                //
                $('#index-gamelist .card-body').click(selectGame);
                $('#index-aside input[name="combination"]').click(function () {
                    let list = $('#index-aside li');
                    if (this.value === '1') { //單場
                        $(list.get(list.length - 4)).hide();
                        $(list.find('.game-money')).show();
                    } else { //過關
                        $(list.get(list.length - 4)).show();
                        $(list.find('.game-money')).hide();
                    }
                    setMoney();
                    // if ($(this).is(':checked')) {
                    //     alert($(this).val());
                    // }
                });
                gsTask(function () {
                    let param = {};
                    param['url'] = '/gbApi/countgameplays';
                    gsGet(param, function (list) {
                        let json = {};
                        $.each(list, function (idx, data) {
                            json[data['gameid']] = data["count"];
                        });
                        let games = $('div.card[data-gameid]');
                        $.each(games, function (idx, game) {
                            let gameid = $(game).attr('data-gameid');
                            if (json[gameid] == null || json[gameid] == '')
                                $(game).find('.card-footer span').empty().append('已投注人數:&nbsp;0&nbsp;人');
                            else
                                $(game).find('.card-footer span').empty().append('已投注人數:&nbsp;' + json[gameid] + '&nbsp;人');
                        });
                    });
                }, 5);
                // {"status":"ok","data":[{"gameid":"G10","count":3},{"gameid":"G100","count":2},{"gameid":"G20","count":3},{"gameid":"G50","count":1}]}
                $('#index-gamelist').hideLoader();
            } catch {
            }
        }
    });
};

function selectGame() {
    //
    let x = $(event.target);
    x = (x.hasClass('card-body')) ? x : x.parent('.card-body');
    x.addClass('bg-warning');
    let p = x.parent('.card');
    //
    let gameid = p.attr('data-gameid');
    let gamename = p.attr('data-gamename');
    // let option = JSON.parse(x.attr('data-option'));
    let optid = x.attr('data-optid');
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
    //
    $('input[name="money"]').on('keyup', setMoney);
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