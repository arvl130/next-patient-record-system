export function getYearsSinceDate(dateStr: string) {
  const givenDate = new Date(dateStr)
  const currentDate = new Date()
  const dateDiffMs = currentDate.getTime() - givenDate.getTime()
  const dateDiff = new Date(dateDiffMs)
  const age = Math.abs(dateDiff.getFullYear() - 1970)

  if (isNaN(age) || age < 0) return "N/A"
  if (age < 1) return "<1"
  return age
}
