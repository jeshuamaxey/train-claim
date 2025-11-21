import { useState, useEffect } from 'react'
import { YStack, ScrollView, Text, Button, ActivityIndicator } from 'tamagui'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { DelayCard } from '../components/DelayCard'
import { DelayInfo, Service } from '../types'
import { getServiceMetrics } from '../lib/api/darwin'
import { calculateDelay } from '../lib/delay-calc'
import { getOperatorByCode, isNorthernRailway } from '../lib/operators'
import '../lib/api/config' // Ensure API config is loaded

export default function DelayScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    serviceId: string
    originCrs: string
    originName: string
    destinationCrs: string
    destinationName: string
    date: string
    scheduledDeparture: string
    scheduledArrival: string
    operatorCode: string
    operatorName: string
  }>()

  const [delayInfo, setDelayInfo] = useState<DelayInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDelayInfo()
  }, [])

  const loadDelayInfo = async () => {
    if (!params.serviceId || !params.originCrs || !params.destinationCrs || !params.date) {
      setError('Missing service parameters')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const dateObj = new Date(params.date)
      const dateStr = dateObj.toISOString().split('T')[0]

      const services = await getServiceMetrics({
        fromLocation: params.originCrs,
        toLocation: params.destinationCrs,
        fromDate: dateStr,
        toDate: dateStr,
        toc: params.operatorCode,
      })

      const service = services.find((s) => s.serviceId === params.serviceId)

      if (!service) {
        setError('Service not found')
        setIsLoading(false)
        return
      }

      if (!service.actualArrival) {
        setError('Actual arrival time not available yet')
        setIsLoading(false)
        return
      }

      const delay = calculateDelay(
        service.scheduledArrival,
        service.actualArrival
      )
      setDelayInfo(delay)
    } catch (err: any) {
      setError(err.message || 'Failed to load delay information')
      console.error('Error loading delay info:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    const operator = getOperatorByCode(params.operatorCode)
    if (!operator) {
      Alert.alert('Error', 'Operator information not found')
      return
    }

    const isNorthern = isNorthernRailway(params.operatorCode)

    if (isNorthern) {
      // For Northern, open in WebView (no pre-fill for MVP)
      await WebBrowser.openBrowserAsync(operator.delayRepayUrl)
    } else {
      // For other operators, open external browser
      await WebBrowser.openBrowserAsync(operator.delayRepayUrl)
      Alert.alert(
        'Claim Form Opened',
        `We've opened ${operator.name}'s claim form. You'll need: journey date, train time, and ticket details.`
      )
    }
  }

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
        <ActivityIndicator size="large" />
        <Text>Loading delay information...</Text>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} padding="$4" gap="$4">
        <Text color="$red10" fontSize="$4">
          {error}
        </Text>
      </YStack>
    )
  }

  if (!delayInfo) {
    return (
      <YStack flex={1} padding="$4">
        <Text>No delay information available</Text>
      </YStack>
    )
  }

  return (
    <ScrollView>
      <YStack flex={1} padding="$4" gap="$4">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="700">
            Delay & Compensation
          </Text>
          <Text fontSize="$3" color="$colorSubtitle">
            {params.originName} → {params.destinationName}
          </Text>
        </YStack>

        <DelayCard delayInfo={delayInfo} operatorName={params.operatorName} />

        {delayInfo.delayMinutes >= 15 && (
          <Button onPress={handleClaim} size="$4">
            <Text color="white" fontWeight="600" fontSize="$4">
              Claim Now
            </Text>
          </Button>
        )}

        {delayInfo.delayMinutes < 15 && (
          <YStack padding="$4" backgroundColor="$yellow2" borderRadius="$3">
            <Text fontSize="$3">
              Your train was less than 15 minutes late. No compensation is due under Delay Repay.
            </Text>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  )
}

