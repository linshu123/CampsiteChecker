'strict';

const CampRequest = require('./CampRequest.js');
const DateFactory = require('./DateFactory.js');
const CampSiteFactory = require('./CampSiteFactory');

function executeOnRepeat(func, interval) {
  setInterval(func, interval);
}(function main() {
  const interestedCampsites = CampSiteFactory.getInterestedCampsites();
  const upcomingWeekendDate = DateFactory.getUpcomingWeekendDate();

  console.log('Checking ' + upcomingWeekendDate.toString().substring(0, 15) + '...');
  for (var i = 0; i < interestedCampsites.length; i++) {
    CampRequest.sendRequest(upcomingWeekendDate, 1, interestedCampsites[i]);
  }
})();
//# sourceMappingURL=../Scheduler.js.map