import request = require('request');

export interface RequestOptions {
  headers: any,
    dataString ? : string,
    url: string,
    method ? : string,
};

// Returns a promise with the request
export function BuildRequestPromise(requestOptions: RequestOptions) {
  let promise = new Promise(function (resolve: (body: any) => void, reject: (error: any) => void) {
    var options = {
      url: requestOptions.url,
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      body: requestOptions.dataString || '',
    };

    request(options, function (error, response, body) {
      if (!error && (response.statusCode == 200 || response.statusCode == 301)) {
        resolve(body);
      } else {
        console.log('Network error: ' + error);
        reject(error);
      }
    });
  });

  return promise;
}