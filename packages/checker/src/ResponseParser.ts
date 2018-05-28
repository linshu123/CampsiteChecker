import cheerio = require('cheerio');

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
  let date = $('#arrivalDate').text();
  let campsiteName = $('#cgroundName').text();
  let summary = $('.matchSummary').text();
  if (summary.length > 0) {
    console.log(campsiteName + " - " + date + ": " + summary);
  } else {
    console.log(campsiteName + ": Can't find result. Cookie may have expired.");
  }
}