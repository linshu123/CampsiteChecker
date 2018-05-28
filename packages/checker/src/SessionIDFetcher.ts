import request = require('request');
import setCookie = require('set-cookie-parser');
import {
  EINVAL
} from 'constants';

const kCookieNameForSessionID = 'JSESSIONID';
const kCookieNameForRauv = '_rauv_';

export class HeaderParam {
  constructor(public key: string, public value: string) {}
  toString(): string {
    return this.key + '=' + this.value;
  }
}

export function FetchSessionID(callBack: (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => void): void {
  let promise = new Promise(function (resolve: any, reject: any) {
    let headers = {
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6'
    };

    let options = {
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
    let sessionIDParam = undefined;
    let rauvParam = undefined;
    // Multiple cookies will be returned. Look for the cookie that has the name `JSESSIONID` and `_rauv_`
    for (let index = 0; index < cookies.length; index++) {
      if (cookies[index].name === kCookieNameForSessionID) {
        sessionIDParam = new HeaderParam(cookies[index].name, cookies[index].value);
      } else if (cookies[index].name === kCookieNameForRauv) {
        rauvParam = new HeaderParam(cookies[index].name, cookies[index].value);
      }
      if (sessionIDParam && rauvParam) {
        console.log('SessionID fetched: ' + sessionIDParam.toString());
        console.log('Rauv fetched: ' + rauvParam.toString());
        callBack(sessionIDParam, rauvParam);
        return;
      }
    }
  });
}