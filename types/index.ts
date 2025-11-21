export interface Station {
  name: string
  crs: string
  lat?: number
  lon?: number
}

export interface Service {
  serviceId: string
  origin: Station
  destination: Station
  scheduledDeparture: string
  scheduledArrival: string
  actualDeparture?: string
  actualArrival?: string
  operator: string
  operatorCode: string
}

export interface DelayInfo {
  scheduledArrival: string
  actualArrival: string
  delayMinutes: number
  compensationPercentage: number
  compensationType: 'single' | 'return'
}

export interface Journey {
  origin: Station
  destination: Station
  date: string
}

export interface Operator {
  code: string
  name: string
  delayRepayUrl: string
  isNorthern?: boolean
}

