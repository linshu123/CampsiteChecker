import {
  SendRequest
} from './CampRequest';
import {
  GetUpcomingTenWeekendDates
} from './DateFactory.js';
import {
  GetInterestedCampsites
} from './CampSiteFactory';

function executeOnRepeat(func: any, interval: number) {
  setInterval(func, interval);
}(function main() {
  let interestedCampsites = GetInterestedCampsites();
  let upcomingWeekendDate = GetUpcomingTenWeekendDates();

  // TODO: it seems recreation.gov caches the response with a cookie. 
  // If I send requests for 5 different campsites for the same date at the same time, only one will respond with valid matchSummary.
  // If I send requests for 5 different dates for the same campsite at the same time, they'll all return with the same availability numbers.
  // for (var i = 0; i < 1; i++) {
  let cachedDate = upcomingWeekendDate[i];
  let cachedCampsite = interestedCampsites[2];
  // Maybe use a timer to spread out traffic (doesn't have any effect for now)
  // setTimeout(function () {
  console.log('Checking ' + cachedDate.toString().substring(0, 15) + '...');
  SendRequest(cachedDate, 1, cachedCampsite);
  // }, 5000 * i);
  // }
})()