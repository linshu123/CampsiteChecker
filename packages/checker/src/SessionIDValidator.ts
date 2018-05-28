import {
  HeaderParam
} from "./SessionIDFetcher";
import request = require("request");
import {
  BuildRequestPromise
} from "./RequestFactory";

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export class SessionIDValidator {

  private randomNonce: string;

  constructor(private sessionID: HeaderParam, private rauv: HeaderParam) {
    this.randomNonce = uuidv4();
  }

  validateSessionID(
    callBack: (
      validatedSessionID: HeaderParam,
      validatedRauv: HeaderParam
    ) => void,
    waitTimeBetweenRequests: number,
  ) {
    // No delay is required between the same set.
    let requestFirstSet1 = this._getRequestPromiseForParkSearchFirstRequest();
    let requestFirstSet2 = this._getRequestPromiseForParkSearchSecondRequest();
    let requestSecondSet1 = this._getRequestPromiseForCampgroundSearchFirstRequest();
    let requestSecondSet2 = this._getRequestPromiseForCampgroundSearchSecondRequest();
    let requestThirdSet1 = this._getRequestPromiseForDateSearchRequest();

    requestFirstSet1.then((body: any) => {
      requestFirstSet2.then((body: any) => {
        console.log("First validation request set succeeded!");
        new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
          requestSecondSet1.then((body: any) => {
            requestSecondSet2.then((body: any) => {
              console.log("Second validation request set succeeded!");
              new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
                requestThirdSet1.then((body: any) => {
                  console.log("Final validation request succeeded!");
                  console.log("Validated sessionID: " + this.sessionID.toString());
                  console.log("Validated rauv: " + this.rauv.toString());
                  callBack(this.sessionID, this.rauv);
                });
              });
            });
          });
        });
      });
    });
  }

  _getSessionIDAndRauvStringForCookie() {
    return this.sessionID.toString() + '; ' + this.rauv.toString() + '; ';
  }

  // Returns a promise.
  _getRequestPromiseForParkSearchFirstRequest() {
    let headers = {
      Connection: "keep-alive",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      Origin: "https://www.recreation.gov",
      "Upgrade-Insecure-Requests": "1",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      Referer: "https://www.recreation.gov/",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
      Cookie: this._getSessionIDAndRauvStringForCookie() + "NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _gat_GSA_ENOR0=1; _gat=1; _4c_=" + this.randomNonce.toString(),
    };

    let dataString =
      "currentMaximumWindow=12&locationCriteria=YOSEMITE+NATIONAL+PARK&interest=&locationPosition=NRSO%3A2991%3A-119.557187300000%3A37.848832880000%3A%3ACA&selectedLocationCriteria=&resetAllFilters=true&filtersFormSubmitted=false&glocIndex=0&googleLocations=Yosemite+National+Park%2C+Tioga+Pass+Road%2C+California%2C+USA%7C-119.53794479999999%7C37.8646393%7C%7CLOCALITY&googleLocations=Yosemite+National+Park+Road%2C+Yosemite+Valley%2C+CA%2C+USA%7C-119.56473349999999%7C37.73972699999999%7C%7CLOCALITY&googleLocations=Yosemite+National+Park+Road%2C+California%2C+USA%7C-119.56473349999999%7C37.73972699999999%7C%7CLOCALITY&googleLocations=Yosemite+National+Park+Road%2C+Wawona%2C+CA%2C+USA%7C-119.36147849999998%7C37.87900679999999%7C%7CLOCALITY&googleLocations=Yosemite+National+Park+Road%2C+Groveland%2C+CA%2C+USA%7C-119.84456820000003%7C37.7676179%7C%7CLOCALITY";

    return BuildRequestPromise({
      url: "https://www.recreation.gov/unifSearch.do",
      method: "POST",
      headers: headers,
      dataString: dataString
    });
  }

  _getRequestPromiseForParkSearchSecondRequest() {
    let headers = {
      Connection: "keep-alive",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      Referer: "https://www.recreation.gov/",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
      Cookie: this._getSessionIDAndRauvStringForCookie() +
        "NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _gat_GSA_ENOR0=1; _gat=1; _4c_=" + this.randomNonce.toString(),
    };

    // Refresh nonce after request set
    this.randomNonce = uuidv4();

    return BuildRequestPromise({
      url: "https://www.recreation.gov/unifSearchResults.do",
      headers: headers
    });
  }

  _getRequestPromiseForCampgroundSearchFirstRequest() {
    let headers = {
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Referer': 'https://www.recreation.gov/unifSearchResults.do',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
      'Cookie': this._getSessionIDAndRauvStringForCookie() +
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=' + +this.randomNonce.toString()
    };

    return BuildRequestPromise({
      url: 'https://www.recreation.gov/unifSearchInterface.do?interface=camping&contractCode=NRSO&parkId=70927',
      headers: headers
    });
  }

  _getRequestPromiseForCampgroundSearchSecondRequest() {
    let headers = {
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Referer': 'https://www.recreation.gov/unifSearchResults.do',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
      'Cookie': this._getSessionIDAndRauvStringForCookie() +
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=' + this.randomNonce.toString()
    };

    // Refresh nonce after request set
    this.randomNonce = uuidv4();

    return BuildRequestPromise({
      url: 'https://www.recreation.gov/camping/north-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70927',
      headers: headers
    });
  }

  _getRequestPromiseForDateSearchRequest() {
    let headers = {
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Origin': 'https://www.recreation.gov',
      'Upgrade-Insecure-Requests': '1',
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Referer': 'https://www.recreation.gov/camping/north-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70927',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
      'Cookie': this._getSessionIDAndRauvStringForCookie() +
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=' + this.randomNonce.toString()
    };

    let dataString = 'contractCode=NRSO&parkId=70927&siteTypeFilter=ALL&availStatus=&submitSiteForm=true&search=site&currentMaximumWindow=12&arrivalDate=Wed+May+30+2018&departureDate=Thu+May+31+2018&flexDates=&loop=&siteCode=&lookingFor=&camping_common_218=&camping_common_3012=&camping_common_3013=';

    return BuildRequestPromise({
      url: 'https://www.recreation.gov/campsiteSearch.do',
      method: 'POST',
      headers: headers,
      dataString: dataString
    });
  }
};