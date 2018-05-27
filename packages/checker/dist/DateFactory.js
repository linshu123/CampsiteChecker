"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _getUpcomingWeekendDate() {
    var now = new Date();
    var day = now.getDay();
    var isWeekendNow = 6 > day;
    var upcomingWeekendDate = new Date();
    upcomingWeekendDate.setDate(now.getDate() + ((isWeekendNow ? 6 : 13) - day));
    return upcomingWeekendDate;
}
exports._getUpcomingWeekendDate = _getUpcomingWeekendDate;
function GetUpcomingTenWeekendDates() {
    var upcomingWeekendDate = _getUpcomingWeekendDate();
    var tenUpcomingWeekends = [];
    for (var i = 0; i < 10; i++) {
        var nextWeekendDate = new Date();
        nextWeekendDate.setDate(upcomingWeekendDate.getDate() + 7 * i);
        tenUpcomingWeekends.push(nextWeekendDate);
    }
    return tenUpcomingWeekends;
}
exports.GetUpcomingTenWeekendDates = GetUpcomingTenWeekendDates;
