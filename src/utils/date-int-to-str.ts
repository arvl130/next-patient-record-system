export function getMonthFromInt(monthInt: number) {
  switch (monthInt) {
    case 0:
      return `January`
    case 1:
      return `February`
    case 2:
      return `March`
    case 3:
      return `April`
    case 4:
      return `May`
    case 5:
      return `June`
    case 6:
      return `July`
    case 7:
      return `August`
    case 8:
      return `September`
    case 9:
      return `October`
    case 10:
      return `November`
    case 11:
      return `December`
    default:
      return "Invalid month"
  }
}

export function getShortenedMonthFromInt(monthInt: number) {
  switch (monthInt) {
    case 0:
      return `Jan`
    case 1:
      return `Feb`
    case 2:
      return `Mar`
    case 3:
      return `Apr`
    case 4:
      return `May`
    case 5:
      return `Jun`
    case 6:
      return `Jul`
    case 7:
      return `Aug`
    case 8:
      return `Sep`
    case 9:
      return `Oct`
    case 10:
      return `Nov`
    case 11:
      return `Dec`
    default:
      return "Invalid month"
  }
}

export function getDayOfTheWeekFromInt(dayOfTheWeekInt: number) {
  switch (dayOfTheWeekInt) {
    case 0:
      return "Sun"
    case 1:
      return "Mon"
    case 2:
      return "Tue"
    case 3:
      return "Wed"
    case 4:
      return "Thu"
    case 5:
      return "Fri"
    case 6:
      return "Sat"
    default:
      return "Invalid day"
  }
}
