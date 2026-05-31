import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const CITY = 'Azor,IL'
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=he`

const REFRESH_MS = 10 * 60 * 1000 // 10 minutes

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  async function fetchWeather() {
    try {
      const res = await fetch(URL)
      if (!res.ok) throw new Error(res.status)
      const data = await res.json()
      setWeather({
        temp: Math.round(data.main.temp),
        feels: Math.round(data.main.feels_like),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
      })
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchWeather()
    const id = setInterval(fetchWeather, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return { weather, error }
}
