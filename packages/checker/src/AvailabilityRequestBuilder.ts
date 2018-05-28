import request = require("request");
import cheerio = require("cheerio");
import querystring = require("querystring");
import {
  ICampsite
} from "./CampsiteFactory";
import {
  AddDays
} from "./DateFactory";
import {
  HeaderParam
} from "./SessionIDFetcher";
import {
  BuildRequestPromise
} from "./RequestFactory";
import {
  IsAvailabilityResponseValid,
  PrintAvailableSiteNumberFromHTML
} from "./ResponseParser";

export function BuildAvailabilityRequestPromise(
  sessionIDParam: HeaderParam,
  arrivalDate: Date,
  stayLength: number,
  campsite: ICampsite
) {
  let headers = {
    Connection: "keep-alive",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    Origin: "https://www.recreation.gov",
    "Upgrade-Insecure-Requests": "1",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    Referer: "https://www.recreation.gov/camping/lower-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70928",
    Cookie: sessionIDParam.toString()
  };

  let departureDate = AddDays(arrivalDate, stayLength);
  let arrivalDateShortString = _getDateShortString(arrivalDate);
  let departureDateShortString = _getDateShortString(departureDate);

  let dataParams = {
    contractCode: "NRSO",
    parkId: campsite.id,
    siteTypeFilter: "ALL",
    submitSiteForm: "true",
    search: "site",
    currentMaximumWindow: "12",
    arrivalDate: arrivalDateShortString,
    departureDate: departureDateShortString
  };

  let dataString = querystring.stringify(dataParams);

  return BuildRequestPromise({
    url: "https://www.recreation.gov/campsiteSearch.do",
    method: "POST",
    headers: headers,
    dataString: dataString
  });
}

// Convert date into format of 'Sat+Jul+21+2018'
function _getDateShortString(date: Date): string {
  return date
    .toString()
    .substr(0, 15)
    .replace(/ /g, "+");
}