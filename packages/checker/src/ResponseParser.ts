import cheerio = require('cheerio');

const kGreenColorConfig = "\x1b[32m";
const kRedColorConfig = "\x1b[31m";
const kResetConfig = "\x1b[0m";

export function IsAvailabilityResponseValid(htmlBody: string): boolean {
  let $ = cheerio.load(htmlBody);
  let summary = $('.matchSummary').text();
  if (summary.length > 0) {
    return summary.includes('site(s) available');
  } else {
    return false;
  }
};

export function PrintAvailableSiteNumberFromHTML(htmlBody: string) {
  let $ = cheerio.load(htmlBody);
  let date = $('#arrivalDate')[0].attribs.value;
  let campsiteName = $('#cgroundName').text();
  let summary = $('.matchSummary').text();
  if (summary.length > 0) {
    let colorConfig = summary.includes('site(s) available') ? kGreenColorConfig : kRedColorConfig;
    console.log(colorConfig, campsiteName + " - " + date + ": " + summary);
    _resetConsoleConfig();
  } else {
    console.log(kRedColorConfig, campsiteName + ": Can't find result. Cookie may have expired.");
    _resetConsoleConfig();
  }
}

function _resetConsoleConfig() {
  console.log(kResetConfig);
}