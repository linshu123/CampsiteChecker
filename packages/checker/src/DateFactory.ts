export function _getUpcomingWeekendDate(): Date {
  var now = new Date();
  var day = now.getDay();
  var isWeekendNow = 6 > day;
  var upcomingWeekendDate = new Date();
  upcomingWeekendDate.setDate(now.getDate() + ((isWeekendNow ? 6 : 13) - day));
  return upcomingWeekendDate;
}

export function GetUpcomingTenWeekendDates(): Array < Date > {
  var upcomingWeekendDate = _getUpcomingWeekendDate();
  var tenUpcomingWeekends = [];
  for (var i = 0; i < 10; i++) {
    let nextWeekendDate = new Date();
    nextWeekendDate.setDate(upcomingWeekendDate.getDate() + 7 * i);
    tenUpcomingWeekends.push(nextWeekendDate);
  }
  return tenUpcomingWeekends;
}