import {
  HeaderParam
} from "./SessionIDFetcher";
import request = require("request");
import {
  BuildRequestPromise
} from "./RequestFactory";

export class SessionIDValidator {

  constructor(
    private sessionID: HeaderParam, private rauv: HeaderParam
  ) {}
  validateSessionID(
    callBack: (
      validatedSessionID: HeaderParam,
      validatedRauv: HeaderParam
    ) => void,
    waitTimeBetweenRequests: number,
  ) {

    let request1 = this._getRequestPromiseForParkSearchFirstRequest();
    let request2 = this._getRequestPromiseForParkSearchSecondRequest();
    let request3 = this._getRequestPromiseForCampgroundSearchFirstRequest();
    let request4 = this._getRequestPromiseForCampgroundSearchSecondRequest();
    let request5 = this._getRequestPromiseForDateSearchRequest();

    request1.then((body: any) => {
      console.log("request1 succeeded!");
      new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
        request2.then((body: any) => {
          console.log("request2 succeeded!");
          new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
            request3.then((body: any) => {
              console.log("request3 succeeded!");
              new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
                request4.then((body: any) => {
                  console.log("request4 succeeded!");
                  new Promise(resolve => setTimeout(resolve, waitTimeBetweenRequests)).then(() => {
                    request5.then((body: any) => {
                      console.log("request5 succeeded! Validation completed!");
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
      Cookie: this._getSessionIDAndRauvStringForCookie() + "NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _gat_GSA_ENOR0=1; _gat=1; _4c_=fVFNb7MwDP4rk8%2BIxvlwArdpk6Yddtz5FYSwVmsbFFjZVPW%2F16FdpbeHIRE55vHzYY4wr8MeajTSapLaSJKigM%2FwM0J9BD%2Fk85CPr7SFGtbTNIz1ajXPc5mCT6GZNnFffsTDCgrwsQsMwqo0peB7m%2BI8hsStp3WKu%2FBAxN2eSaG3ou1cZUkb07vGVyp46ijIhq1I5RgX2QK8NZ7LFPqQ0sLEt3EzZZn%2F9bk%2FhbTLM1wO7BmQi230zTajOWUBL4%2F%2F3l%2BfF4sWJQp%2By9%2FowsKpgO%2FLLox2DoUVmlknDu5Ii%2FwwIm2661IAnSePHaK12iiDrQpk214p2Va97itWXPiU4URaOKoywcB8yzze5LQllz%2FTVQ71TS4nuUNnc8JZwT%2Fq3txl43%2FMyPuZ0%2BkM"
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
        "NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _gat_GSA_ENOR0=1; _gat=1; _4c_=fVFNb7MwDP4rk8%2BIxvlwArdpk6Yddtz5FYSwVmsbFFjZVPW%2F16FdpbeHIRE55vHzYY4wr8MeajTSapLaSJKigM%2FwM0J9BD%2Fk85CPr7SFGtbTNIz1ajXPc5mCT6GZNnFffsTDCgrwsQsMwqo0peB7m%2BI8hsStp3WKu%2FBAxN2eSaG3ou1cZUkb07vGVyp46ijIhq1I5RgX2QK8NZ7LFPqQ0sLEt3EzZZn%2F9bk%2FhbTLM1wO7BmQi230zTajOWUBL4%2F%2F3l%2BfF4sWJQp%2By9%2FowsKpgO%2FLLox2DoUVmlknDu5Ii%2FwwIm2661IAnSePHaK12iiDrQpk214p2Va97itWXPiU4URaOKoywcB8yzze5LQllz%2FTVQ71TS4nuUNnc8JZwT%2Fq3txl43%2FMyPuZ0%2BkM"
    };

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
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=fVFLb6MwEP4rqzkjgl8PuFWtVPWwl656XoEZF1QSI0PCVlH%2Be8YkjbatVCSs8fDN9xiOsHS4g4opbqTmqtRW8Aze8H2C6ghuTOchHfs4QAXdPI9Ttdksy5JHdBHruQ%2B7%2FDUcNvtd7%2F9gHV33jNN%2BmKe8DZCBCy3SICtzlRd0b2JYJozUuu9i2OIvranrSQi8KZrWlkZLpbytXSnQ6VYjr8keF5ZwgWzB79pRGdFjjCsT3aZ%2BTjKfPVF%2FxrhNM1SOlAM4FUNw9ZDQlDyDx7u%2FL08Pq0XDOCvoza%2FrkIWBUwb%2FLvtR0lpljDTEOtMyrJZFeggR%2B%2Fa6KGDWacdaxgiphGKNQG0aLwRvSi99SYorn1CUSBZWl4lgJL51nt3kpNE2fdZXOSZvcinJiqZf9cXcB%2Fo%2Fc5eN%2FzDzLdDpdAY%3D'
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
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=fVFLb6MwEP4rqzkjgl8PuFWtVPWwl656XoEZF1QSI0PCVlH%2Be8YkjbatVCSs8fDN9xiOsHS4g4opbqTmqtRW8Aze8H2C6ghuTOchHfs4QAXdPI9Ttdksy5JHdBHruQ%2B7%2FDUcNvtd7%2F9gHV33jNN%2BmKe8DZCBCy3SICtzlRd0b2JYJozUuu9i2OIvranrSQi8KZrWlkZLpbytXSnQ6VYjr8keF5ZwgWzB79pRGdFjjCsT3aZ%2BTjKfPVF%2FxrhNM1SOlAM4FUNw9ZDQlDyDx7u%2FL08Pq0XDOCvoza%2FrkIWBUwb%2FLvtR0lpljDTEOtMyrJZFeggR%2B%2Fa6KGDWacdaxgiphGKNQG0aLwRvSi99SYorn1CUSBZWl4lgJL51nt3kpNE2fdZXOSZvcinJiqZf9cXcB%2Fo%2Fc5eN%2FzDzLdDpdAY%3D'
    };

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
        'NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0745525d5f4f58455e445a4a4221e5; _ga=GA1.2.1971210121.1527462407; _gid=GA1.2.422169860.1527462407; _4c_=fVBda9wwEPwrZR%2F6dLUl68syhFISKHloCy19LrIk35ncWWatxC3h%2FntWzjX0A2KwWK1mZ3bmEdZDnKDjqjFSN4ZzadkO7uKvBbpH8HM5H8pxj0fo4JDzvHR1va5rhdFjdHlMU7VPD7V3p3mc9vWUMB%2FeURmXGrfuHtP9FG5iduNxqUJ679OU0fl8nUK8%2Bvz125e3s8O723BlmG0M7MDTA6lxW6mK0b3HtC4RqXV9wHSKb7Sm7kDbwWBYH1prtFRqaJ23InoddGwceWpES7hEXuCT81RiHCLixkS3ZcxF5m8j1M8RT2WGypnMg6DimLw7FjTFtYOPH358v73ZVjS84Yz%2B6pKhZAbOO%2Fj5HKqiPBk31hBrpgRbLVn5CIFjuKQLvPXa88C5MVIJxXsRtekHIZreDnKwpLjxCUWOJGu1LQQz8W3z%2FEVOGt2WZ32R4%2FJFrjjZ0OK%2F5X6j%2F1juOfFXZuy%2FM%2BfzEw%3D%3D'
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