import request = require("request");
import fs = require("fs");
import {
  ICampsite,
  GetInterestedCampsites
} from "./CampsiteFactory";
import {
  FetchSessionID,
  HeaderParam
} from "./SessionIDFetcher";
import {
  GetUpcomingTenWeekendDates
} from "./DateFactory.js";
import {
  SessionIDValidator
} from "./SessionIDValidator";
import {
  BatchRequestVerifier
} from "./BatchRequestVerifier";
import {
  IsAvailabilityResponseValid,
  PrintAvailableSiteNumberFromHTML
} from "./ResponseParser";
import {
  BuildAvailabilityRequestPromise
} from "./AvailabilityRequestBuilder";

export function SendRequest() {
  FetchSessionID((sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
    _sendBatchRequestWithSessionID(sessionIDParam, rauvParam);
  });
}

function _sendBatchRequestWithSessionID(
  sessionIDParam: HeaderParam,
  rauvParam: HeaderParam
): void {
  let sessionIDValidator = new SessionIDValidator(sessionIDParam, rauvParam);
  sessionIDValidator.validateSessionID(
    (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
      let interestedCampsites = GetInterestedCampsites();
      let upcomingWeekendDate = GetUpcomingTenWeekendDates();
      for (var i = 0; i < 1; i++) {
        let cachedDate = upcomingWeekendDate[0];
        let cachedCampsite = interestedCampsites[1];
        console.log(
          "Checking " + cachedDate.toString().substring(0, 15) + "..."
        );
        _getAvailabilityOfCampsite(
          sessionIDParam,
          cachedDate,
          1,
          cachedCampsite
        );
      }
    },
    3000
  );
}

function _getAvailabilityOfCampsite(
  sessionIDParam: HeaderParam,
  arrivalDate: Date,
  stayLength: number,
  campsite: ICampsite
) {
  let batchRequestVerifier = new BatchRequestVerifier(
    () => {
      return BuildAvailabilityRequestPromise(
        sessionIDParam,
        arrivalDate,
        stayLength,
        campsite
      );
    },
    3, // Number of attempts
    IsAvailabilityResponseValid,
    (didSucceed: boolean, body: string) => {
      PrintAvailableSiteNumberFromHTML(body);
    }
  );

  batchRequestVerifier.startBatchRequest();
}

function _writeReponseToFile(fileName: string, content: string) {
  fs.writeFile(fileName, content, function (err) {});
}