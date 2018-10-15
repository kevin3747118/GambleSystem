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

function gsGet(param, callback) {
  $.get(param['url'], {
      data: param['data']
    },
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

function gsPost(param, callback) {
  $.post(param['url'], {
      data: ''
    },
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
  param['url'] = 'https://127.0.0.1:8787/getGames';
  gsGet(param, function (data) {
    if (data != null) {
      let html =
        `<div class="row mb-3">
    <div class="col-md-12">
      <div class="card shadow-sm" data-gameid="{gameid}" data-gamedate="{gamedate}" data-a="{a}" data-h="{h}">
        <div class="card-footer">
          <strong class="text-primary">{gamedate}</strong>
        </div>
        <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-key="a">
          <div class="gb-card-team">{a-team}</div>
          <div>{a-pitcher} ({a-state}, {a-era})</div>
          <h5 style="text-align: right">{a-odd}</h5>
        </div>
        <div class="card-body h-md-100" data-gameid="{gameid}" data-key="h">
        <div class="gb-card-team">{h-team}</div>
        <div>{h-pitcher} ({h-state}, {h-era})</div>
        <h5 style="text-align: right">{h-odd}</h5>
        </div>
      </div>
    </div>
</div>`;
      try {
        Object.keys(data).forEach(function eachKey(gameid) {
          let game = html.replaceAll('{gameid}', gameid);
          game = game.replaceAll('{gamedate}', data[gameid]['gamedate']);
          game = game.replaceAll('{a}', data[gameid]['game']['a']);
          game = game.replaceAll('{h}', data[gameid]['game']['h']);
          game = game.replaceAll('{a-team}', data[gameid]['game']['a'][0]);
          game = game.replaceAll('{a-pitcher}', data[gameid]['competitors']['a'][0]);
          game = game.replaceAll('{a-state}', data[gameid]['competitors']['a'][1]);
          game = game.replaceAll('{a-era}', data[gameid]['competitors']['a'][2]);
          game = game.replaceAll('{a-odd}', data[gameid]['game']['a'][2]);
          game = game.replaceAll('{h-team}', data[gameid]['game']['h'][0]);
          game = game.replaceAll('{h-pitcher}', data[gameid]['competitors']['h'][0]);
          game = game.replaceAll('{h-state}', data[gameid]['competitors']['h'][1]);
          game = game.replaceAll('{h-era}', data[gameid]['competitors']['h'][2]);
          game = game.replaceAll('{h-odd}', data[gameid]['game']['h'][2]);
          // game = String.format(game, gameid,
          //     data[gameid]['gamedate'], data[gameid]['game']['a'], data[gameid]['game']['h'],
          //     data[gameid]['game']['a'][0], data[gameid]['competitors']['a'][0],
          //     data[gameid]['competitors']['a'][1], data[gameid]['competitors']['a'][2], data[gameid]['game']['a'][2],
          //     data[gameid]['game']['h'][0], data[gameid]['competitors']['h'][0],
          //     data[gameid]['competitors']['h'][1], data[gameid]['competitors']['h'][2], data[gameid]['game']['h'][2]);
          $('#index-gamelist').append(game);
        });
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
        $('#index-gamelist').hideLoader();
      } catch {}
    }
  });
};

function loadWCGame() {
  $('#index-gamelist').showLoader();
  let param = {};
  param['url'] = 'https://127.0.0.1:8787/getWCGames';
  gsGet(param, function (data) {
    if (data != null) {
      try {
        Object.keys(data).forEach(function eachKey(gameid) {
          if (Object.keys(data[gameid]['game']).length <= 3) {
            let html =
              `<div class="row mb-3">
        <div class="col-md-12">
          <div class="card shadow-sm" data-gameid="{gameid}">
            <div class="card-footer">
              <strong class="text-primary">{game}</strong>
            </div>
            <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-key="a">
              <div class="gb-card-team">{ateam}</div>
              <h5 style="text-align: right">{atodd}</h5>
            </div>
            <div class="card-body h-md-100" data-gameid="{gameid}" data-key="h">
            <div class="gb-card-team">{hteam}</div>
            <h5 style="text-align: right">{htodd}</h5>
            </div>
          </div>
        </div>
    </div>`;
            let game = html.replaceAll('{gameid}', gameid);
            game = game.replaceAll('{game}', data[gameid]['game'].area);
            game = game.replaceAll('{ateam}', data[gameid]['game']['a'][0]);
            game = game.replaceAll('{hteam}', data[gameid]['game']['h'][0]);
            game = game.replaceAll('{atodd}', data[gameid]['game']['a'][2]);
            game = game.replaceAll('{htodd}', data[gameid]['game']['h'][2]);
            $('#index-gamelist').append(game);
          } else {
            let html =
              `<div class="row mb-3">
        <div class="col-md-12">
          <div class="card shadow-sm" data-gameid="{gameid}">
            <div class="card-footer">
              <strong class="text-primary">{game}</strong>
            </div>
            <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-key="a1">
              <div class="gb-card-team">{a1team}</div>
              <h5 style="text-align: right">{a1todd}</h5>
            </div>
            <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-key="h1">
            <div class="gb-card-team">{h1team}</div>
            <h5 style="text-align: right">{h1todd}</h5>
            </div>
            <div class="card-body border-top border-bottom h-md-100" data-gameid="{gameid}" data-key="a2">
            <div class="gb-card-team">{a2team}</div>
            <h5 style="text-align: right">{a2todd}</h5>
            </div>
            <div class="card-body h-md-100" data-gameid="{gameid}" data-key="h2">
            <div class="gb-card-team">{h2team}</div>
            <h5 style="text-align: right">{h2todd}</h5>
            </div>
          </div>
        </div>
    </div>`;
            let game = html.replaceAll('{gameid}', gameid);
            game = game.replaceAll('{game}', data[gameid]['game'].area);
            game = game.replaceAll('{a1team}', data[gameid]['game']['a1'][0]);
            game = game.replaceAll('{h1team}', data[gameid]['game']['h1'][0]);
            game = game.replaceAll('{a2team}', data[gameid]['game']['a2'][0]);
            game = game.replaceAll('{h2team}', data[gameid]['game']['h2'][0]);
            game = game.replaceAll('{a1todd}', data[gameid]['game']['a1'][2]);
            game = game.replaceAll('{h1todd}', data[gameid]['game']['h1'][2]);
            game = game.replaceAll('{a2todd}', data[gameid]['game']['a2'][2]);
            game = game.replaceAll('{h2todd}', data[gameid]['game']['h2'][2]);
            $('#index-gamelist').append(game);
          }
          // game = String.format(game, gameid,
          //     data[gameid]['gamedate'], data[gameid]['game']['a'], data[gameid]['game']['h'],
          //     data[gameid]['game']['a'][0], data[gameid]['competitors']['a'][0],
          //     data[gameid]['competitors']['a'][1], data[gameid]['competitors']['a'][2], data[gameid]['game']['a'][2],
          //     data[gameid]['game']['h'][0], data[gameid]['competitors']['h'][0],
          //     data[gameid]['competitors']['h'][1], data[gameid]['competitors']['h'][2], data[gameid]['game']['h'][2]);
        });
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
        $('#index-gamelist').hideLoader();
      } catch {}
    }
  });
};

function selectGame() {
  //
  let x = $(event.target);
  x = (x.hasClass('card-body')) ? x : x.parent('.card-body');
  x.addClass('bg-warning');
  //
  let gameid = x.attr('data-gameid');
  let gamedate = x.parent('.card').attr('data-gamedate');
  let xkey = x.attr('data-key');
  let ykey = (xkey === 'a') ? 'h' : 'a';
  let xdata = x.parent('.card').attr('data-' + xkey).split(',');
  let ydata = x.parent('.card').attr('data-' + ykey).split(',');
  $('div.card-body[data-gameid="' + gameid + '"][data-key="' + ykey + '"]').removeClass('bg-warning');
  //
  let combination = $('#index-aside input[name="combination"]:checked').val();
  let outerHtml = `<li class="list-group-item game" data-gameid="{0}"></li>`;
  let innerHtml = `
    <input type="hidden" name="key" value="{0}"/>
    <input type="hidden" name="gameid" value="{1}"/>
    <input type="hidden" name="bet" value="{2}"/>
    <input type="hidden" name="totaloddperset" value="{3}"/>
    <strong>{4} ({3})</strong><br>
    <small>{5}<br>{6} @ {7}</small>
    <div class="game-money" {8}><input type="text" name="money" placeholder="本金" /><span>可贏得 0 元</span></div>`;
  outerHtml = String.format(outerHtml, gameid);
  innerHtml = String.format(innerHtml, xkey, gameid, xdata['1'], xdata['2'], xdata['0'], gamedate,
    (xkey === 'a') ? xdata['0'] : ydata['0'],
    (xkey === 'a') ? ydata['0'] : xdata['0'],
    (combination === '1') ? '' : 'style="display:none;"');
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
  } else {
    $(list[3]).after($(outerHtml).append(innerHtml));
  }
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
      let odd = $(game).find('input[name="totaloddperset"]').val();
      let money = $(game).find('input[name="money"]').val();
      let earn = parseInt(odd.toFloat() * money.toFloat());
      $(game).find('.game-money span').empty().append('可贏得 ' + earn + ' 元');
      moneys += money.toFloat();
      earns += earn;
    });
  } else if (combination === '2') {
    let group = $('#index-aside li.group');
    let games = $('#index-aside li.game');
    $.each(games, function (idx, game) {
      let odd = $(game).find('input[name="totaloddperset"]').val();
      if (odds === 0)
        odds = odd;
      else
        odds *= odd.toFloat();
    });
    odds = odds.toFixed(2);
    moneys = $(group).find('input[name="money"]').val();
    earns = parseInt(odds * moneys.toFloat());
    $(group).find('input[name="totaloddperset"]').val(odds);
    $(group).find('.group-odd').empty().append('過關賠率 ' + odds);
    $(group).find('.group-money span').empty().append('可贏得 ' + earns + ' 元');
  } else {
    // 3 guess final results

  }
  $('#index-aside li.gs-moneys').empty().append('投注總金額 ' + moneys + ' 元');
  $('#index-aside li.gs-earns').empty().append('最高可贏 ' + earns + ' 元');
}