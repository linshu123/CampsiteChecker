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
import loadJsonFile from "load-json-file";
import writeJsonFile from "write-json-file";
import {
  SessionIDIsValid
} from "./SessionIDVerifier";

const kFileNameForCachedSessionID = "./cache/valid_session_id.json";

export function SendRequest() {
  let timeStamp = new Date().toLocaleTimeString();
  console.log("******* Start job ******* " + timeStamp);
  let interestedCampsite = GetInterestedCampsites()[5];
  _getVerifiedSessionID(interestedCampsite, (sessionIDParam: HeaderParam) => {
    _sendBatchRequestWithSessionID(sessionIDParam, interestedCampsite);
  });
}

function _getVerifiedSessionID(
  campsite: ICampsite,
  callback: (sessionIDParam: HeaderParam) => void
) {
  loadJsonFile(kFileNameForCachedSessionID).then(json => {
    let sessionIDParam = new HeaderParam(json.name, json.value);
    console.log('Loaded session ID: ' + sessionIDParam.toString());
    SessionIDIsValid(
      sessionIDParam,
      campsite,
      (isValid: boolean, sessionIDParam: HeaderParam) => {
        if (isValid) {
          // If session ID is valid, execute call back.
          console.log('Cached session ID works. Checking availability...');
          callback(sessionIDParam);
        } else {
          // Otherwise, fetch & validate a new session ID and execute call back if it's successsfal.
          console.log("Cached session ID doesn't work, fetch and validate a new session ID");
          FetchSessionID((sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
            _validateSessionID(sessionIDParam, rauvParam, (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
              SessionIDIsValid(
                sessionIDParam,
                campsite,
                (isValid: boolean, sessionIDParam: HeaderParam) => {
                  // If session ID is valid, save to file and continue with request using that session ID.
                  console.log("Writing new session ID to cached session ID file.");
                  writeJsonFile(kFileNameForCachedSessionID, {
                    name: sessionIDParam.key,
                    value: sessionIDParam.value
                  });
                  if (isValid) {
                    console.log("New session ID works. Checking availability...");
                    callback(sessionIDParam);
                  } else {
                    console.log("New session ID doesn't work. Terminate.");
                  }
                }
              );
            });
          });
        }
      }
    );
  });
}

function _validateSessionID(
  sessionIDParam: HeaderParam,
  rauvParam: HeaderParam,
  callback: (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => void
) {
  let sessionIDValidator = new SessionIDValidator(sessionIDParam, rauvParam);
  sessionIDValidator.validateSessionID(
    (sessionIDParam: HeaderParam, rauvParam: HeaderParam) => {
      callback(sessionIDParam, rauvParam);
    },
    3000
  );
}

function _sendBatchRequestWithSessionID(sessionIDParam: HeaderParam, campsite: ICampsite): void {
  let upcomingWeekendDate = GetUpcomingTenWeekendDates();
  for (var i = 0; i < 1; i++) {
    let cachedDate = upcomingWeekendDate[0];
    console.log("Checking " + cachedDate.toString().substring(0, 15) + "...");
    _getAvailabilityOfCampsite(sessionIDParam, cachedDate, 1, campsite);
  }
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