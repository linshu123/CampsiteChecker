import request = require('request');
import cheerio = require('cheerio');
import fs = require('fs');
import querystring = require('querystring');
import {
  ICampsite,
  GetInterestedCampsites
} from './CampsiteFactory'

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
    'Cookie': '_rauv_=B25D239C10298A6CDC5181254D487698.awolvprodweb15_; _ga=GA1.2.2050808312.1520809742; _gid=GA1.2.1340066757.1526182292; JSESSIONID=F3227C8F5A74800EE3CD9AED3ACD6774.awolvprodweb09; NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f3045525d5f4f58455e445a4a4221e5; _4c_=XZJPa9wwEMW%2FStGhp62tf7YkQyglgZJDW2jpucjSeNfEa5mxNm5Z9rtntE0DW188evPTk%2FzGZ7YdYGadaKTRQmhhLDc79gR%2FVtadGY6xvJ5Zx4TRuvfCNzZaZ6y2BrQyA8h%2BCAMfWrZjv4uPEkq20rlWicuORfL%2Buz%2FC4E9TvsEU11wXbPxH%2Bf%2F7gjfUx%2B0VeGu05H%2BLFoXQsLyiZ3bCiSwPOS9rV9fbtlUIAcHnMc3VPj3XwR%2BXcd7XU9oAP1AJa41XdY%2FpNMcHyH6c1iqmjyHNGX3I9ynC3dfvP769Xzw%2BPcY7w520dOtAjRKTq5qK07rHtK2AJN0fMB3hXduQOtDtGAcVemcEOBu44DFaYVoeTfBgeukDcYniZ1%2BuJcIAiFcnWq1jLsfcfgjpGfBY9lC5lCAVFVMKfio0TXjHPn%2F69fPxgVaSN9xyq4SsaOxUOqMlAWVWb2OiJK%2Fh0m%2FhjOFKiZYOyRSobTUvz%2BVyeQE%3D'
  };

  var departureDate = new Date();
  departureDate.setDate(arrivalDate.getDate() + stayLength);

  const arrivalDateShortString = getDateShortString(arrivalDate);
  const departureDateShortString = getDateShortString(departureDate);

  const dataParams = {
    "contractCode": "NRSO",
    "parkId": campsite.id,
    "siteTypeFilter": "ALL",
    "submitSiteForm": "true",
    "search": "site",
    "currentMaximumWindow": "12",
    "arrivalDate": arrivalDateShortString,
    "departureDate": departureDateShortString,
  };

  const dataString = querystring.stringify(dataParams);

  var options = {
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