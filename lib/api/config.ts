import { setDarwinConfig } from './darwin'

/**
 * Configure Darwin HSP API credentials
 * 
 * Get your credentials from: https://www.nationalraildataportal.co.uk/
 * 
 * You can either:
 * 1. Set them directly here (not recommended for production)
 * 2. Use environment variables
 * 3. Load from a secure storage solution
 */

// Option 1: Set directly (for development/testing)
// setDarwinConfig('your-username', 'your-password')

// Option 2: Use environment variables
if (process.env.DARWIN_USERNAME && process.env.DARWIN_PASSWORD) {
  setDarwinConfig(process.env.DARWIN_USERNAME, process.env.DARWIN_PASSWORD)
}

// Option 3: Load from secure storage (implement as needed)
// import * as SecureStore from 'expo-secure-store'
// async function loadCredentials() {
//   const username = await SecureStore.getItemAsync('darwin_username')
//   const password = await SecureStore.getItemAsync('darwin_password')
//   if (username && password) {
//     setDarwinConfig(username, password)
//   }
// }

export function configureDarwinAPI(username: string, password: string) {
  setDarwinConfig(username, password)
}

