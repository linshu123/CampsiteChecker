import request = require('request');
import cheerio = require('cheerio');
import fs = require('fs');
import querystring = require('querystring');
import {
  ICampsite,
  GetInterestedCampsites,
} from './CampsiteFactory';
import {
  AddDays
} from './DateFactory';
import {
  FetchSessionID,
  HeaderParam
} from './SessionIDFetcher';
import {
  GetUpcomingTenWeekendDates,
} from './DateFactory.js';
import {
  BuildRequestPromise
} from "./RequestFactory";
import {
  SessionIDValidator
} from "./SessionIDValidator";
import {
  BatchRequestVerifier
} from './BatchRequestVerifier';

export function SendRequest() {
  FetchSessionID((sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
    _sendBatchRequestWithSessionID(sessionIDParam, rauvParam);
  });
}

function _sendBatchRequestWithSessionID(sessionIDParam: HeaderParam, rauvParam: HeaderParam): void {
  let sessionIDValidator = new SessionIDValidator(sessionIDParam, rauvParam);
  sessionIDValidator.validateSessionID(
    (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
      let interestedCampsites = GetInterestedCampsites();
      let upcomingWeekendDate = GetUpcomingTenWeekendDates();
      for (var i = 0; i < 1; i++) {
        let cachedDate = upcomingWeekendDate[0];
        let cachedCampsite = interestedCampsites[2];
        console.log('Checking ' + cachedDate.toString().substring(0, 15) + '...');
        _getAvailabilityOfCampsite(sessionIDParam, cachedDate, 1, cachedCampsite);
      }
    }, 3000);
}

function _getAvailabilityOfCampsite(sessionIDParam: HeaderParam, arrivalDate: Date, stayLength: number, campsite: ICampsite) {
  let batchRequestVerifier = new BatchRequestVerifier(
    () => {
      return _getAvailabilityRequestPromise(sessionIDParam, arrivalDate, stayLength, campsite);
    },
    3, // Number of attempts
    _isAvailabilityResponseValid,
    (didSucceed: boolean, body: string) => {
      _printAvailableSiteNumberFromHTML(body);
    }
  );

  batchRequestVerifier.startBatchRequest();
}

function _getAvailabilityRequestPromise(
  sessionIDParam: HeaderParam,
  arrivalDate: Date,
  stayLength: number,
  campsite: ICampsite) {
  let headers = {
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Origin': 'https://www.recreation.gov',
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://www.recreation.gov/camping/lower-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70928',
    'Cookie': sessionIDParam.toString(),
  };
  // console.log('Using overridden cookie');

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

  return BuildRequestPromise({
    url: 'https://www.recreation.gov/campsiteSearch.do',
    method: 'POST',
    headers: headers,
    dataString: dataString
  });
}

// Convert date into format of 'Sat+Jul+21+2018'
function _getDateShortString(date: Date): string {
  return date.toString().substr(0, 15).replace(/ /g, '+');
}

function _writeReponseToFile(fileName: string, content: string) {
  fs.writeFile(fileName, content, function (err) {});
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

function _isAvailabilityResponseValid(htmlBody: string): boolean {
  let $ = cheerio.load(htmlBody);
  let summary = $('.matchSummary').text();
  if (summary.length > 0) {
    return summary.includes('site(s) available');
  } else {
    return false;
  }
}