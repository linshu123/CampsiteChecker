// Returns an Date array of upcoming 10 Saturdays.
export function GetUpcomingTenWeekendDates(): Array < Date > {
  let upcomingWeekendDate = _getUpcomingWeekendDate();
  let tenUpcomingWeekends = [];
  for (var i = 0; i < 10; i++) {
    tenUpcomingWeekends.push(_addDays(upcomingWeekendDate, i * 7));
  }
  return tenUpcomingWeekends;
}

function _getUpcomingWeekendDate(): Date {
  let now = new Date();
  let day = now.getDay();
  let isWeekendNow = 6 > day;
  let upcomingWeekendDate = _addDays(now, (isWeekendNow ? 6 : 13) - day);
  console.log('upcomingWeekendDate: ' + upcomingWeekendDate);
  return upcomingWeekendDate;
}

function _addDays(date: Date, numberOfDays: number): Date {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + numberOfDays);
  return newDate;
}