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

  console.log('Checking ' + upcomingWeekendDate.toString().substring(0, 15) + '...');
  for (var i = 0; i < interestedCampsites.length; i++) {
    SendRequest(upcomingWeekendDate[0], 1, interestedCampsites[i]);
  }
})()