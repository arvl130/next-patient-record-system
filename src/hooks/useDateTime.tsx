import { useEffect, useState } from "react"
import {
  getShortenedMonthFromInt,
  getDayOfTheWeekFromInt,
} from "../utils/date-int-to-str"

export function useDateTime() {
  function getCurrentDateTime() {
    const date = new Date()
    const currentDate = `${getShortenedMonthFromInt(
      date.getMonth()
    )} ${date.getDate()}, ${date.getFullYear()}`

    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    const currentTime = `${getDayOfTheWeekFromInt(
      date.getDay()
    )} ${date.getHours()}:${minutes}`

    return {
      date: currentDate,
      time: currentTime,
    }
  }

  const [{ date, time }, setDateTime] = useState(getCurrentDateTime())
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(getCurrentDateTime())
    }, 1000 * 60)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    date,
    time,
  }
}
