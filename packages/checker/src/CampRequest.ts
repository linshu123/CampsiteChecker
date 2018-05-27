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
    'Cookie': '_rauv_=B25D239C10298A6CDC5181254D487698.awolvprodweb15_; _ga=GA1.2.2050808312.1520809742; _gid=GA1.2.1288529124.1527410569; JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13; NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5; _4c_=XZFNa%2BMwEIb%2FStHZOPq0JN9KC0sPe9ml5yJLo9rUiYLsxC3B%2Fz2jNA2kuXg%2BHr0zeedElh52pGWKaym1EpRTXZEP%2BJpIeyJ5COVzJC1h2O8cc8oEY7WRRoMUOgLvoo80NqQin0VHMMEbbm0j2FqRgNrf7wNEdxjnO0xQSWXBhh%2FK%2Fe4zqrCflytwazSof4%2BWCqJ%2Bf0VP5JBHlOzneT%2B1m82yLHUGn8HNQ9rV7%2Bm4OeyG%2BB9c9v0%2FmHC5qQ4JF%2FApQPnHtlY1xbzLaZkgY%2Bmpz2kLD43CasRBhILwndUMrPGU0RAM0w0N2jvQHXceuYROkr%2BXMEOEnC9KmE3DXMbc74T1GfK2vMFwXzwRGIzJu7HQeKyK%2FHl8e315xoxTRQ01gvEaL4ih1ZIjUGy%2FOY6mXHzieF6hlbVK4ZAZvTGNpOW3rusZ'
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