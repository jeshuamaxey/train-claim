import { YStack, Text, Button } from 'tamagui'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  title?: string
}

export function ErrorDisplay({ error, onRetry, title = 'Error' }: ErrorDisplayProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
      gap="$4"
    >
      <YStack alignItems="center" gap="$2">
        <Text fontSize="$6" fontWeight="700" color="$red10">
          {title}
        </Text>
        <Text fontSize="$4" color="$colorSubtitle" textAlign="center">
          {error}
        </Text>
      </YStack>
      {onRetry && (
        <Button onPress={onRetry}>
          <Text color="white" fontWeight="600">
            Try Again
          </Text>
        </Button>
      )}
    </YStack>
  )
}

