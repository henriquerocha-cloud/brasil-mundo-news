'use client'

import { useEffect, useState } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Loader2 } from 'lucide-react'

// Utilizando Open-Meteo API (gratuita, sem chave) para São Paulo como padrão
// Se tivéssemos mais tempo, poderíamos pegar do IP do usuário
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=America%2FSao_Paulo'

interface WeatherData {
  temp: number
  max: number
  min: number
  code: number
}

function getWeatherIcon(code: number) {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0 || code === 1) return <Sun className="w-4 h-4 text-orange-500" />
  if (code >= 2 && code <= 48) return <Cloud className="w-4 h-4 text-gray-500" />
  if (code >= 51 && code <= 67) return <CloudRain className="w-4 h-4 text-blue-500" />
  if (code >= 71 && code <= 77) return <CloudSnow className="w-4 h-4 text-sky-300" />
  if (code >= 80 && code <= 82) return <CloudRain className="w-4 h-4 text-blue-600" />
  if (code >= 95) return <CloudLightning className="w-4 h-4 text-purple-600" />
  return <Sun className="w-4 h-4 text-orange-500" />
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(WEATHER_API_URL)
        const data = await res.json()
        
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          max: Math.round(data.daily.temperature_2m_max[0]),
          min: Math.round(data.daily.temperature_2m_min[0]),
          code: data.current_weather.weathercode
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
        <span>Carregando clima...</span>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
      {getWeatherIcon(weather.code)}
      <span className="text-foreground font-bold">{weather.temp}°</span>
      <span>Máx. {weather.max}° Min. {weather.min}°, hoje em <span className="text-primary hover:underline cursor-pointer">São Paulo</span></span>
    </div>
  )
}
