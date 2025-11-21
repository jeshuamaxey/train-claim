import { TamaguiProvider } from '@tamagui/core'
import { Stack } from 'expo-router'
import config from '../tamagui.config'

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Claim Now' }} />
        <Stack.Screen name="trains" options={{ title: 'Select Train' }} />
        <Stack.Screen name="delay" options={{ title: 'Delay & Compensation' }} />
      </Stack>
    </TamaguiProvider>
  )
}

