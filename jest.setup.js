import '@testing-library/jest-native/extend-expect'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage[key] || null)),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value
      return Promise.resolve()
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key]
      return Promise.resolve()
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key])
      return Promise.resolve()
    }),
  }
})

