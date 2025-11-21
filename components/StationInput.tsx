import { useState } from 'react'
import { Pressable } from 'react-native'
import { YStack, Input, ScrollView, Text } from 'tamagui'
import { searchStations } from '../lib/stations'
import { Station } from '../types'

interface StationInputProps {
  label: string
  value: Station | null
  onSelect: (station: Station) => void
  placeholder?: string
}

export function StationInput({
  label,
  value,
  onSelect,
  placeholder = 'Search station...',
}: StationInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Station[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (text: string) => {
    setQuery(text)
    if (text.length >= 2) {
      try {
        const matches = searchStations(text)
        setResults(matches)
        setShowResults(true)
      } catch (error) {
        console.error('Error searching stations:', error)
        setResults([])
      }
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleSelect = (station: Station) => {
    onSelect(station)
    setQuery(station.name)
    setShowResults(false)
  }

  return (
    <YStack gap="$2" position="relative">
      <Input
        placeholder={placeholder}
        value={query || value?.name || ''}
        onChangeText={handleSearch}
        onFocus={() => {
          if (query.length >= 2) {
            setShowResults(true)
          }
        }}
        onBlur={() => {
          // Delay hiding to allow tap on results
          setTimeout(() => setShowResults(false), 200)
        }}
      />
      {showResults && results.length > 0 && (
        <ScrollView
          maxHeight={200}
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={1000}
          elevation={5}
        >
          {results.map((station) => (
            <Pressable
              key={station.crs}
              onPress={() => handleSelect(station)}
            >
              <YStack padding="$3" hoverStyle={{ backgroundColor: '$backgroundHover' }}>
                <Text fontSize="$4" fontWeight="600">
                  {station.name}
                </Text>
                <Text fontSize="$2" color="$colorSubtitle">
                  {station.crs}
                </Text>
              </YStack>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </YStack>
  )
}

