import {
  IsAvailabilityResponseValid,
  PrintAvailableSiteNumberFromHTML
} from "./ResponseParser";
import {
  ICampsite,
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
export function SessionIDIsValid(
  sessionIDParam: HeaderParam,
  campsite: ICampsite,
  callback: (isValid: boolean, sessionIDParam: HeaderParam) => void
) {
  let upcomingWeekendDate = GetUpcomingWeekendDate();
  let batchRequestVerifier = new BatchRequestVerifier(
    () => {
      return BuildAvailabilityRequestPromise(
        sessionIDParam,
        upcomingWeekendDate,
        1,
        campsite,
      );
    },
    3, // Number of attempts
    IsAvailabilityResponseValid,
    (didSucceed: boolean, body: string) => {
      callback(didSucceed, sessionIDParam);
    }
  );

  batchRequestVerifier.startBatchRequest();
}