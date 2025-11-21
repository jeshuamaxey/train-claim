import { useState } from 'react'
import { Platform } from 'react-native'
import { YStack, Input, Button, Text } from 'tamagui'
import DateTimePicker from '@react-native-community/datetimepicker'

interface DatePickerProps {
  value: string // YYYY-MM-DD format
  onChange: (date: string) => void
  label?: string
}

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const dateObj = new Date(value)

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios')
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0]
      onChange(dateStr)
    }
  }

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (Platform.OS === 'web') {
    return (
      <YStack gap="$2">
        {label && (
          <Text fontSize="$4" fontWeight="600">
            {label}
          </Text>
        )}
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
          }}
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$2">
      {label && (
        <Text fontSize="$4" fontWeight="600">
          {label}
        </Text>
      )}
      <Button onPress={() => setShowPicker(true)}>
        <Text color="white">{formatDisplayDate(value)}</Text>
      </Button>
      {showPicker && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </YStack>
  )
}

