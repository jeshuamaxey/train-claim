import { useState, useEffect } from 'react'
import { YStack, ScrollView, Text, ActivityIndicator } from 'tamagui'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ServiceCard } from '../components/ServiceCard'
import { Service, Station } from '../types'
import { getServiceDetails } from '../lib/api/darwin'
import { getOperatorByCode } from '../lib/operators'
import '../lib/api/config' // Ensure API config is loaded

export default function TrainsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    originCrs: string
    originName: string
    destinationCrs: string
    destinationName: string
    date: string
  }>()

  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    if (!params.originCrs || !params.destinationCrs || !params.date) {
      setError('Missing journey parameters')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const dateObj = new Date(params.date)
      const dateStr = dateObj.toISOString().split('T')[0]

      const fetchedServices = await getServiceDetails({
        fromLocation: params.originCrs,
        toLocation: params.destinationCrs,
        fromDate: dateStr,
        toDate: dateStr,
      })

      // Resolve operator names
      const servicesWithOperators = fetchedServices.map((service) => {
        const operator = getOperatorByCode(service.operatorCode)
        return {
          ...service,
          operator: operator?.name || service.operatorCode,
        }
      })

      setServices(servicesWithOperators)
    } catch (err: any) {
      setError(err.message || 'Failed to load services')
      console.error('Error loading services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceSelect = (service: Service) => {
    router.push({
      pathname: '/delay',
      params: {
        serviceId: service.serviceId,
        originCrs: params.originCrs,
        originName: params.originName,
        destinationCrs: params.destinationCrs,
        destinationName: params.destinationName,
        date: params.date,
        scheduledDeparture: service.scheduledDeparture,
        scheduledArrival: service.scheduledArrival,
        operatorCode: service.operatorCode,
        operatorName: service.operator,
      },
    })
  }

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
        <ActivityIndicator size="large" />
        <Text>Loading trains...</Text>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} padding="$4" gap="$4">
        <Text color="$red10" fontSize="$4">
          {error}
        </Text>
        <Text fontSize="$3" color="$colorSubtitle">
          Make sure you've configured your Darwin API credentials.
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} padding="$4" gap="$4">
      <YStack gap="$2">
        <Text fontSize="$6" fontWeight="700">
          Select Your Train
        </Text>
        <Text fontSize="$3" color="$colorSubtitle">
          {params.originName} → {params.destinationName}
        </Text>
        <Text fontSize="$2" color="$colorSubtitle">
          {new Date(params.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </YStack>

      {services.length === 0 ? (
        <YStack alignItems="center" justifyContent="center" padding="$8">
          <Text fontSize="$4" color="$colorSubtitle">
            No services found for this route
          </Text>
        </YStack>
      ) : (
        <ScrollView>
          <YStack gap="$3">
            {services.map((service) => (
              <ServiceCard
                key={service.serviceId}
                service={service}
                onPress={() => handleServiceSelect(service)}
              />
            ))}
          </YStack>
        </ScrollView>
      )}
    </YStack>
  )
}

