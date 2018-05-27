import request = require('request');
import cheerio = require('cheerio');
import fs = require('fs');
import querystring = require('querystring');
import {
  ICampsite,
  GetInterestedCampsites,
} from './CampsiteFactory'
import {
  AddDays
} from './DateFactory'
import {
  FetchSessionID,
  ISessionIDParam
} from './SessionIDFetcher';
import {
  GetUpcomingTenWeekendDates,
} from './DateFactory.js';

export function SendRequest() {
  FetchSessionID((sessionIDParam: ISessionIDParam) => {
    _sendBatchRequestWithSessionID(sessionIDParam);
  });
}

function _sendBatchRequestWithSessionID(sessionIDParam: ISessionIDParam): void {

  let interestedCampsites = GetInterestedCampsites();
  let upcomingWeekendDate = GetUpcomingTenWeekendDates();

  // TODO: it seems recreation.gov caches the response with a cookie. 
  // If I send requests for 5 different campsites for the same date at the same time, only one will respond with valid matchSummary.
  // If I send requests for 5 different dates for the same campsite at the same time, they'll all return with the same availability numbers.
  // for (var i = 0; i < 1; i++) {
  let cachedDate = upcomingWeekendDate[0];
  let cachedCampsite = interestedCampsites[4];
  // Maybe use a timer to spread out traffic (doesn't have any effect for now)
  // setTimeout(function () {
  console.log('Checking ' + cachedDate.toString().substring(0, 15) + '...');
  _sendRequest(sessionIDParam, cachedDate, 1, cachedCampsite);
  // }, 5000 * i);
  // }
}

function _sendRequest(sessionIDParam: ISessionIDParam, arrivalDate: Date, stayLength: number, campsite: ICampsite) {
  let cookie = sessionIDParam.key + '=' + sessionIDParam.value;
  console.log('Fetching with cookie: ' + cookie);
  var headers = {
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Origin': 'https://www.recreation.gov',
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://www.recreation.gov/camping/lower-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70928',
    'Cookie': cookie,
  };

  let departureDate = AddDays(arrivalDate, stayLength);
  let arrivalDateShortString = _getDateShortString(arrivalDate);
  let departureDateShortString = _getDateShortString(departureDate);

  let dataParams = {
    "contractCode": "NRSO",
    "parkId": campsite.id,
    "siteTypeFilter": "ALL",
    "submitSiteForm": "true",
    "search": "site",
    "currentMaximumWindow": "12",
    "arrivalDate": arrivalDateShortString,
    "departureDate": departureDateShortString,
  };

  let dataString = querystring.stringify(dataParams);

  let options = {
    url: 'https://www.recreation.gov/campsiteSearch.do',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  request(options, callback);
}

// Convert date into format of 'Sat+Jul+21+2018'
function _getDateShortString(date: Date): string {
  return date.toString().substr(0, 15).replace(/ /g, '+');
}

function _writeReponseToFile(fileName: string, content: string) {
  fs.writeFile(fileName, content, function (err) {});
}

function callback(error: string, response: any, body: string) {
  if (!error && response.statusCode == 200) {
    _writeReponseToFile("./temp/response.html", body);
    _printAvailableSiteNumberFromHTML(body);
  } else if (error) {
    console.log(error);
  }
}

function _printAvailableSiteNumberFromHTML(htmlBody: string) {
  let $ = cheerio.load(htmlBody);
  let date = $('#arrivalDate').text();
  let campsiteName = $('#cgroundName').text();
  let summary = $('.matchSummary').text();
  if (summary.length > 0) {
    console.log(campsiteName + " - " + date + ": " + summary);
  } else {
    console.log(campsiteName + ": Can't find result. Cookie may have expired.");
  }
}