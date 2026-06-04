'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Loader2, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { format, addDays, parseISO, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DailyForecast {
  date: string
  max: number
  min: number
  code: number
}

interface WeatherData {
  temp: number
  max: number
  min: number
  code: number
  city: string
  daily: DailyForecast[]
}

export function getWeatherIcon(code: number, className = "w-4 h-4") {
  if (code === 0 || code === 1) return <Sun className={`${className} text-orange-500`} />
  if (code >= 2 && code <= 48) return <Cloud className={`${className} text-gray-500`} />
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-blue-500`} />
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-sky-300`} />
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-600`} />
  if (code >= 95) return <CloudLightning className={`${className} text-purple-600`} />
  return <Sun className={`${className} text-orange-500`} />
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      try {
        let lat = -23.5505
        let lon = -46.6333
        let city = 'São Paulo'

        try {
          const ipRes = await fetch('https://ipapi.co/json/')
          if (ipRes.ok) {
            const ipData = await ipRes.json()
            if (ipData.latitude && ipData.longitude) {
              lat = ipData.latitude
              lon = ipData.longitude
              city = ipData.city || city
            }
          }
        } catch (e) {
          console.log("Falha ao obter IP, usando fallback de SP")
        }

        const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`
        
        const res = await fetch(WEATHER_API_URL)
        const data = await res.json()
        
        const dailyForecasts: DailyForecast[] = []
        // Começa do índice 1 (amanhã) até 7 dias
        for (let i = 1; i < 8; i++) {
          if (data.daily.time[i]) {
            dailyForecasts.push({
              date: data.daily.time[i],
              max: Math.round(data.daily.temperature_2m_max[i]),
              min: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily.weathercode[i]
            })
          }
        }

        setWeather({
          temp: Math.round(data.current_weather.temperature),
          max: Math.round(data.daily.temperature_2m_max[0]),
          min: Math.round(data.daily.temperature_2m_min[0]),
          code: data.current_weather.weathercode,
          city: city,
          daily: dailyForecasts
        })
      } catch (error) {
        console.error('Failed to fetch weather', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Buscando clima local...</span>
      </div>
    )
  }

  if (!weather) return null

  return (
    <>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center p-1 hover:bg-muted rounded text-primary transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
          {getWeatherIcon(weather.code)}
          <span className="text-foreground font-bold">{weather.temp}°</span>
          <span>
            Máx.{weather.max}° Mín.{weather.min}°, hoje em <span className="text-primary hover:underline cursor-pointer">{weather.city}</span>
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-border shadow-sm z-40 py-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="container mx-auto px-4 flex justify-between items-center overflow-x-auto no-scrollbar gap-6">
            {weather.daily.map((day, idx) => {
              const dateObj = parseISO(day.date)
              const isTom = isTomorrow(dateObj)
              const formattedDate = isTom 
                ? \`amanhã, \${format(dateObj, 'd/M')}\`
                : format(dateObj, 'eee, d/M', { locale: ptBR })

              return (
                <div key={idx} className="flex flex-col items-center flex-shrink-0 border-l border-border/50 pl-6 first:border-0 first:pl-0">
                  <span className="text-xs text-muted-foreground font-medium mb-1 lowercase">
                    {formattedDate}
                  </span>
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(day.code, "w-5 h-5")}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-[15px] text-foreground">{day.max}°</span>
                      <span className="text-[13px] text-muted-foreground">{day.min}°</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
