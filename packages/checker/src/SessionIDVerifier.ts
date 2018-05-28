import {
  IsAvailabilityResponseValid,
  PrintAvailableSiteNumberFromHTML
} from "./ResponseParser";
import {
  ICampsite,
  GetTestCampsite
} from "./CampsiteFactory";
import {
  HeaderParam
} from "./SessionIDFetcher";
import {
  GetUpcomingWeekendDate
} from "./DateFactory.js";
import {
  BatchRequestVerifier
} from "./BatchRequestVerifier";
import {
  BuildAvailabilityRequestPromise
} from "./AvailabilityRequestBuilder";

/* 
  Given a session ID, verify it's validated or not, by sending an availability 
  request and check the response.
*/
export function VerifySessionID(sessionIDParam: HeaderParam) {
  let upcomingWeekendDate = GetUpcomingWeekendDate();
  let interestedCampsites = GetTestCampsite();
  let batchRequestVerifier = new BatchRequestVerifier(
    () => {
      return BuildAvailabilityRequestPromise(
        sessionIDParam,
        upcomingWeekendDate,
        1,
        interestedCampsites,
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