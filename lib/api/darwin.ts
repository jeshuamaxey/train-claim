import { Service, Station } from '../../types'

const DARWIN_API_BASE = 'https://hsp-prod.rockshore.net/api/v1'

export interface DarwinConfig {
  username: string
  password: string
}

let config: DarwinConfig | null = null

export function setDarwinConfig(username: string, password: string) {
  config = { username, password }
}

export function getDarwinConfig(): DarwinConfig | null {
  return config
}

async function darwinRequest(endpoint: string, body: any): Promise<any> {
  if (!config) {
    throw new Error('Darwin API credentials not configured. Please set your username and password.')
  }

  const response = await fetch(`${DARWIN_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      username: config.username,
      password: config.password,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Darwin API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export interface ServiceDetailsParams {
  fromLocation: string // CRS code
  toLocation: string // CRS code
  fromDate: string // YYYY-MM-DD
  toDate: string // YYYY-MM-DD
  fromTime?: string // HH:mm
  toTime?: string // HH:mm
}

export interface ServiceDetailsResponse {
  trainServices?: Array<{
    serviceAttributesDetails: {
      dateOfService: string
      tocCode: string
      rid: string
    }
    locationDetail: {
      origin: Array<{
        location: string
        crs: string
        publicTime: string
      }>
      destination: Array<{
        location: string
        crs: string
        publicTime: string
      }>
    }
  }>
}

export async function getServiceDetails(
  params: ServiceDetailsParams
): Promise<Service[]> {
  const response: ServiceDetailsResponse = await darwinRequest('/serviceDetails', {
    fromLocation: params.fromLocation,
    toLocation: params.toLocation,
    fromDate: params.fromDate,
    toDate: params.toDate,
    fromTime: params.fromTime || '0000',
    toTime: params.toTime || '2359',
  })

  if (!response.trainServices || response.trainServices.length === 0) {
    return []
  }

  return response.trainServices.map((service) => {
    const origin = service.locationDetail.origin[0]
    const destination = service.locationDetail.destination[0]

    return {
      serviceId: service.serviceAttributesDetails.rid,
      origin: {
        name: origin.location,
        crs: origin.crs,
      },
      destination: {
        name: destination.location,
        crs: destination.crs,
      },
      scheduledDeparture: `${params.fromDate}T${origin.publicTime}`,
      scheduledArrival: `${params.toDate}T${destination.publicTime}`,
      operator: '', // Will be resolved from TOC code
      operatorCode: service.serviceAttributesDetails.tocCode,
    }
  })
}

export interface ServiceMetricsParams {
  fromLocation: string // CRS code
  toLocation: string // CRS code
  fromDate: string // YYYY-MM-DD
  toDate: string // YYYY-MM-DD
  fromTime?: string // HH:mm
  toTime?: string // HH:mm
  toc?: string // TOC code filter
}

export interface ServiceMetricsResponse {
  Services?: Array<{
    serviceAttributesDetails: {
      rid: string
      dateOfService: string
      tocCode: string
    }
    originLocation: Array<{
      location: string
      crs: string
      publicTime: string
      actualTime?: string
    }>
    destinationLocation: Array<{
      location: string
      crs: string
      publicTime: string
      actualTime?: string
    }>
  }>
}

export async function getServiceMetrics(
  params: ServiceMetricsParams
): Promise<Service[]> {
  const response: ServiceMetricsResponse = await darwinRequest('/serviceMetrics', {
    fromLocation: params.fromLocation,
    toLocation: params.toLocation,
    fromDate: params.fromDate,
    toDate: params.toDate,
    fromTime: params.fromTime || '0000',
    toTime: params.toTime || '2359',
    toc: params.toc,
  })

  if (!response.Services || response.Services.length === 0) {
    return []
  }

  return response.Services.map((service) => {
    const origin = service.originLocation[0]
    const destination = service.destinationLocation[0]

    return {
      serviceId: service.serviceAttributesDetails.rid,
      origin: {
        name: origin.location,
        crs: origin.crs,
      },
      destination: {
        name: destination.location,
        crs: destination.crs,
      },
      scheduledDeparture: `${params.fromDate}T${origin.publicTime}`,
      scheduledArrival: `${params.toDate}T${destination.publicTime}`,
      actualDeparture: origin.actualTime
        ? `${params.fromDate}T${origin.actualTime}`
        : undefined,
      actualArrival: destination.actualTime
        ? `${params.toDate}T${destination.actualTime}`
        : undefined,
      operator: '', // Will be resolved from TOC code
      operatorCode: service.serviceAttributesDetails.tocCode,
    }
  })
}

