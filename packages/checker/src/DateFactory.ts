// Returns an Date array of upcoming 10 Saturdays.
export function GetUpcomingTenWeekendDates(): Array < Date > {
  let upcomingWeekendDate = GetUpcomingWeekendDate();
  let tenUpcomingWeekends = [];
  for (var i = 0; i < 10; i++) {
    tenUpcomingWeekends.push(AddDays(upcomingWeekendDate, i * 7));
  }
  return tenUpcomingWeekends;
}

export function GetUpcomingWeekendDate(): Date {
  let now = new Date();
  let day = now.getDay();
  let isWeekendNow = 6 > day;
  let upcomingWeekendDate = AddDays(now, (isWeekendNow ? 6 : 13) - day);
  return upcomingWeekendDate;
}

export function AddDays(date: Date, numberOfDays: number): Date {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + numberOfDays);
  return newDate;
}