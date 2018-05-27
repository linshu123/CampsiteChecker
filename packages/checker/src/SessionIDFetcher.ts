import request = require('request');
import setCookie = require('set-cookie-parser');

const kCookieNameForSessionID = 'JSESSIONID';

export interface ISessionIDParam {
  key: string,
    value: string,
}

export function FetchSessionID(callBack: (sessionIDParam: ISessionIDParam) => void): void {
  let promise = new Promise(function (resolve: any, reject: any) {
    var headers = {
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6'
    };

    var options = {
      url: 'https://www.recreation.gov/',
      headers: headers
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });

  promise.then((response: any) => {
    let cookies = setCookie.parse(response);

    // Multiple cookies will be returned. Look for the cookie that has the name `JSESSIONID`
    for (let index = 0; index < cookies.length; index++) {
      if (cookies[0].name === kCookieNameForSessionID) {
        callBack({
          key: cookies[0].name,
          value: cookies[0].value,
        })
        return;
      }
    }
  });
}