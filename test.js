const request = require("request");
const cheerio = require("cheerio");

config = require('./.gbConfig/gbConfig.json');

function reqAPI(method) {
  return new Promise((resolve, reject) => {
    let options = {
      url: config.SPORTS_CATEGORY,
      method: method,
      json: true,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      agentOptions: {
        rejectUnauthorized: false
      }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(body)
        // const $ = cheerio.load(body);
        // const table_tr = $(".bets bets-event-page clearfix span");
        // resolve(table_tr)
      }
    })
  })
}

reqAPI('GET')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })



// var options = {
//   method: 'GET',
//   url: 'https://www.sportslottery.com.tw/web/services/rs/betting/activeCategories/15102/0.json',
//   qs: {
//     drawOffset: '3',
//     locale: 'tw',
//     brandId: 'defaultBrand',
//     channelId: '1'
//   },
//   headers: {
//     'cache-control': 'no-cache',
//     cookie: 'COOKIE_SUPPORT=true; _ga=GA1.3.605522063.1539002055; _gid=GA1.3.68351549.1539002105; BAYEUX_BROWSER=fdben59gwinz22h3jn0ydtz91e4e; __utmc=141265648; __utmz=141265648.1539042864.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utma=141265648.605522063.1539002055.1539042864.1539047867.3; JSESSIONID=D5097D3EE74CCD0EDF061584ADAE1186.node4; __utmb=141265648.28.10.1539047867',
//     'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,ko;q=0.5',
//     'accept-encoding': 'gzip, deflate, br',
//     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
//     'upgrade-insecure-requests': '1'
//   }
// };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log(body);
// });