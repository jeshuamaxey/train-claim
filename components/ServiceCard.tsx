import { YStack, XStack, Text, Pressable } from 'tamagui'
import { Service } from '../types'

interface ServiceCardProps {
  service: Service
  onPress: () => void
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Pressable onPress={onPress}>
      <YStack
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
        hoverStyle={{ backgroundColor: '$backgroundHover' }}
      >
      <XStack justifyContent="space-between" alignItems="center">
        <YStack gap="$2">
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$6" fontWeight="600">
              {formatTime(service.scheduledDeparture)}
            </Text>
            <Text fontSize="$4" color="$colorSubtitle">
              →
            </Text>
            <Text fontSize="$6" fontWeight="600">
              {formatTime(service.scheduledArrival)}
            </Text>
          </XStack>
          <Text fontSize="$3" color="$colorSubtitle">
            {service.operator || service.operatorCode}
          </Text>
        </YStack>
      </XStack>
      </YStack>
    </Pressable>
  )
}

