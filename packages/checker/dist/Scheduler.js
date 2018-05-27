"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CampRequest_1 = require("./CampRequest");
var DateFactory_js_1 = require("./DateFactory.js");
var CampSiteFactory_1 = require("./CampSiteFactory");
function executeOnRepeat(func, interval) {
    setInterval(func, interval);
}
(function main() {
    var interestedCampsites = CampSiteFactory_1.GetInterestedCampsites();
    var upcomingWeekendDate = DateFactory_js_1.GetUpcomingTenWeekendDates();
    console.log('Checking ' + upcomingWeekendDate.toString().substring(0, 15) + '...');
    for (var i = 0; i < interestedCampsites.length; i++) {
        CampRequest_1.SendRequest(upcomingWeekendDate[0], 1, interestedCampsites[i]);
    }
})();
