import { useState, useEffect } from 'react'
import { YStack, XStack, Button, Text, Input, Pressable } from 'tamagui'
import { useRouter } from 'expo-router'
import { Platform } from 'react-native'
import { StationInput } from '../components/StationInput'
import { Station, Journey } from '../types'
import { setStationsData, getRecentJourneys, saveRecentJourney } from '../lib/stations'
import stationsData from '../data/stations.json'
import '../lib/api/config' // Initialize API config

export default function HomeScreen() {
  const router = useRouter()
  const [origin, setOrigin] = useState<Station | null>(null)
  const [destination, setDestination] = useState<Station | null>(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [recentJourneys, setRecentJourneys] = useState<Journey[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load station data
    try {
      setStationsData(stationsData as Station[])
    } catch (error) {
      console.error('Error loading station data:', error)
    }

    // Load recent journeys
    getRecentJourneys().then(setRecentJourneys)
  }, [])

  const handleFindTrains = async () => {
    if (!origin || !destination) {
      return
    }

    setIsLoading(true)
    
    // Save as recent journey
    const journey: Journey = {
      origin,
      destination,
      date,
    }
    await saveRecentJourney(journey)

    router.push({
      pathname: '/trains',
      params: {
        originCrs: origin.crs,
        originName: origin.name,
        destinationCrs: destination.crs,
        destinationName: destination.name,
        date,
      },
    })
    setIsLoading(false)
  }

  const handleRecentJourneySelect = (journey: Journey) => {
    setOrigin(journey.origin)
    setDestination(journey.destination)
    setDate(journey.date)
  }

  return (
    <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
      <YStack gap="$2">
        <Text fontSize="$8" fontWeight="700">
          Claim Now
        </Text>
        <Text fontSize="$4" color="$colorSubtitle">
          Get your money back from delayed trains
        </Text>
      </YStack>

      <YStack gap="$4">
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600">
            Origin Station
          </Text>
          <StationInput
            label="Origin"
            value={origin}
            onSelect={setOrigin}
            placeholder="Enter origin station..."
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600">
            Destination Station
          </Text>
          <StationInput
            label="Destination"
            value={destination}
            onSelect={setDestination}
            placeholder="Enter destination station..."
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600">
            Date
          </Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}
            />
          ) : (
            <Input
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
          )}
        </YStack>

        <Button
          onPress={handleFindTrains}
          disabled={!origin || !destination || isLoading}
          opacity={!origin || !destination || isLoading ? 0.5 : 1}
        >
          <Text color="white" fontWeight="600">
            {isLoading ? 'Loading...' : 'Find Trains'}
          </Text>
        </Button>
      </YStack>

      {recentJourneys.length > 0 && (
        <YStack gap="$2" marginTop="$4">
          <Text fontSize="$4" fontWeight="600">
            Recent Journeys
          </Text>
          {recentJourneys.map((journey, index) => (
            <Pressable
              key={index}
              onPress={() => handleRecentJourneySelect(journey)}
            >
              <YStack
                padding="$3"
                backgroundColor="$backgroundHover"
                borderRadius="$3"
              >
                <Text fontSize="$3">
                  {journey.origin.name} → {journey.destination.name}
                </Text>
                <Text fontSize="$2" color="$colorSubtitle">
                  {new Date(journey.date).toLocaleDateString('en-GB')}
                </Text>
              </YStack>
            </Pressable>
          ))}
        </YStack>
      )}
    </YStack>
  )
}

