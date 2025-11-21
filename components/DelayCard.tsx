import { YStack, XStack, Text } from 'tamagui'
import { DelayInfo } from '../types'
import { formatDelayMessage } from '../lib/delay-calc'

interface DelayCardProps {
  delayInfo: DelayInfo
  operatorName: string
}

export function DelayCard({ delayInfo, operatorName }: DelayCardProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <YStack gap="$4" padding="$4" backgroundColor="$background" borderRadius="$4">
      <YStack gap="$2">
        <Text fontSize="$3" color="$colorSubtitle">
          Scheduled Arrival
        </Text>
        <Text fontSize="$6" fontWeight="600">
          {formatTime(delayInfo.scheduledArrival)}
        </Text>
        <Text fontSize="$2" color="$colorSubtitle">
          {formatDate(delayInfo.scheduledArrival)}
        </Text>
      </YStack>

      <YStack gap="$2">
        <Text fontSize="$3" color="$colorSubtitle">
          Actual Arrival
        </Text>
        <Text fontSize="$6" fontWeight="600" color="$red10">
          {formatTime(delayInfo.actualArrival)}
        </Text>
        <Text fontSize="$2" color="$colorSubtitle">
          {formatDate(delayInfo.actualArrival)}
        </Text>
      </YStack>

      <YStack
        padding="$3"
        backgroundColor="$blue2"
        borderRadius="$3"
        gap="$2"
      >
        <Text fontSize="$4" fontWeight="600">
          Delay: {delayInfo.delayMinutes} minutes
        </Text>
        <Text fontSize="$3">{formatDelayMessage(delayInfo)}</Text>
      </YStack>

      <YStack>
        <Text fontSize="$3" color="$colorSubtitle">
          Operator: {operatorName}
        </Text>
      </YStack>
    </YStack>
  )
}

