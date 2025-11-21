/**
 * Script to fetch and process National Rail Knowledgebase station data from API
 * 
 * Usage:
 * Run: npx ts-node scripts/process-stations.ts
 * 
 * This will fetch station data from the API and generate data/stations.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

interface StationData {
  name: string
  crs: string
  lat?: number
  lon?: number
}

const API_URL = 'https://api1.raildata.org.uk/1010-nationalrail-knowledgebase-stations-feed-_json_---production5_0/stations'
const API_KEY = 'TaAFB9tQbRbKAGWBDOATV2hoCFOuYgxKbnhDonhaT62JbnLK'

async function fetchStations(): Promise<{ rawData: any, processedStations: StationData[] }> {
  console.log('Fetching stations from API...')
  
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'x-apikey': API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()
  
  // Transform API response to StationData format
  // The API response structure may vary, so we'll handle common field names
  const stations: StationData[] = []
  
  // Handle array response
  if (Array.isArray(rawData)) {
    for (const item of rawData) {
      const station: StationData = {
        name: item.name || item.Name || item.stationName || '',
        crs: item.crs || item.CRS || item.crsCode || '',
        lat: item.lat || item.Latitude || item.latitude ? parseFloat(item.lat || item.Latitude || item.latitude) : undefined,
        lon: item.lon || item.Longitude || item.longitude ? parseFloat(item.lon || item.Longitude || item.longitude) : undefined,
      }
      
      if (station.name && station.crs) {
        stations.push(station)
      }
    }
  } else if (rawData.stations && Array.isArray(rawData.stations)) {
    // Handle nested stations array
    for (const item of rawData.stations) {
      const station: StationData = {
        name: item.name || item.Name || item.stationName || '',
        crs: item.crs || item.CRS || item.crsCode || '',
        lat: item.lat || item.Latitude || item.latitude ? parseFloat(item.lat || item.Latitude || item.latitude) : undefined,
        lon: item.lon || item.Longitude || item.longitude ? parseFloat(item.lon || item.Longitude || item.longitude) : undefined,
      }
      
      if (station.name && station.crs) {
        stations.push(station)
      }
    }
  } else {
    throw new Error('Unexpected API response format')
  }

  return {
    rawData,
    processedStations: stations.sort((a, b) => a.name.localeCompare(b.name))
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const outputPath = path.join(__dirname, '..', 'data', 'stations.json')
  const rawOutputPath = path.join(__dirname, '..', 'data', 'stations-raw.json')

  try {
    const { rawData, processedStations } = await fetchStations()
    console.log(`Found ${processedStations.length} stations`)

    // Save raw API response
    fs.writeFileSync(rawOutputPath, JSON.stringify(rawData, null, 2))
    console.log(`Saved raw response to ${rawOutputPath}`)

    // Save processed stations
    fs.writeFileSync(outputPath, JSON.stringify(processedStations, null, 2))
    console.log(`Saved processed stations to ${outputPath}`)
  } catch (error) {
    console.error('Error fetching stations:', error)
    process.exit(1)
  }
}

main()

