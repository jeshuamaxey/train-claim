import AsyncStorage from '@react-native-async-storage/async-storage'
import { Station, Journey } from '../types'

const RECENT_JOURNEYS_KEY = '@train_claim:recent_journeys'
const MAX_RECENT_JOURNEYS = 3

let stationsCache: Station[] | null = null

export function setStationsData(stations: Station[]) {
  stationsCache = stations
}

export function getStationsData(): Station[] {
  if (!stationsCache) {
    throw new Error('Station data not loaded. Please load station data first.')
  }
  return stationsCache
}

export function searchStations(query: string): Station[] {
  const stations = getStationsData()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return []
  }

  // Exact CRS code match
  const crsMatch = stations.find(
    (s) => s.crs.toLowerCase() === lowerQuery
  )
  if (crsMatch) {
    return [crsMatch]
  }

  // Fuzzy name search
  return stations
    .filter((station) => {
      const nameLower = station.name.toLowerCase()
      return (
        nameLower.includes(lowerQuery) ||
        nameLower.startsWith(lowerQuery) ||
        station.crs.toLowerCase().includes(lowerQuery)
      )
    })
    .slice(0, 10) // Limit results
}

export async function getRecentJourneys(): Promise<Journey[]> {
  try {
    const data = await AsyncStorage.getItem(RECENT_JOURNEYS_KEY)
    if (!data) {
      return []
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading recent journeys:', error)
    return []
  }
}

export async function saveRecentJourney(journey: Journey): Promise<void> {
  try {
    const recent = await getRecentJourneys()
    const updated = [
      journey,
      ...recent.filter(
        (j) =>
          !(
            j.origin.crs === journey.origin.crs &&
            j.destination.crs === journey.destination.crs
          )
      ),
    ].slice(0, MAX_RECENT_JOURNEYS)

    await AsyncStorage.setItem(RECENT_JOURNEYS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving recent journey:', error)
  }
}

