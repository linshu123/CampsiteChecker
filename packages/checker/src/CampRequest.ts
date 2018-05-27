import request = require('request');
import cheerio = require('cheerio');
import fs = require('fs');
import querystring = require('querystring');
import {
  ICampsite,
  GetInterestedCampsites
} from './CampsiteFactory'
import {
  AddDays
} from './DateFactory'

export function SendRequest(arrivalDate: Date, stayLength: number, campsite: ICampsite) {
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
    'Cookie': '_rauv_=B25D239C10298A6CDC5181254D487698.awolvprodweb15_; _ga=GA1.2.2050808312.1520809742; JSESSIONID=C1ADE4C60BCAB852B8D2DA1F47AE3746.awolvprodweb13; NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f3045525d5f4f58455e445a4a4221e5; _gid=GA1.2.1288529124.1527410569; _gat_GSA_ENOR0=1; _gat=1; _4c_=XZHNqtswEIVfpWhtnNGfJXlXbqF00VXpusjSuDZ1IiM7cS%2FB755RmhtIDcZnZj6dSY6ubBvwxFquhVFcg5JGy4r9wfeFtVeWx1g%2BF9YybpTqPPfaRuuMVdYgwT2Krg899A2r2N%2FiI7kUjXCukXyvWCTvf%2Bcj9v48rS%2BYBAWqYOMH5f%2Bfc9A0z9sDeA4a8n9FS4fQMD%2FQKzvniSyHdZ2X9nDYtq3OGDL6dUyn%2Bne6HII%2Fzsu44g%2F0OQx1TLQ9pIjl77pa10B1l9O2YKbW25DTET81mro9bWGAMnTOcHQ2AIcYLTcNRBM8mk74QFyiGNn3u8zYY853J6rKWlKvP4j6K%2BZjOUNyLoFIElMKfio03VTFvn7%2B9fPbF6oEaLBgJRc1XR9JZ5QgoGT%2BjJsSuYckjAaupKOXlqwUjG0UlGff9xs%3D'
  };

  let departureDate = AddDays(arrivalDate, stayLength);
  let arrivalDateShortString = getDateShortString(arrivalDate);
  let departureDateShortString = getDateShortString(departureDate);

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
function getDateShortString(date: Date): string {
  return date.toString().substr(0, 15).replace(/ /g, '+');
}

function writeReponseToFile(fileName: string, content: string) {
  fs.writeFile(fileName, content, function (err) {});
}

function callback(error: string, response: any, body: string) {
  if (!error && response.statusCode == 200) {
    writeReponseToFile("./temp/response.html", body);
    printAvailableSiteNumberFromHTML(body);
  } else if (error) {
    console.log(error);
  }
}

function printAvailableSiteNumberFromHTML(htmlBody: string) {
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