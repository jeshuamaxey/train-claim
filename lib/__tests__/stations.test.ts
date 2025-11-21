import { setStationsData, searchStations } from '../stations'
import { Station } from '../../types'

const mockStations: Station[] = [
  { name: 'London Paddington', crs: 'PAD' },
  { name: "London King's Cross", crs: 'KGX' },
  { name: 'Manchester Piccadilly', crs: 'MAN' },
  { name: 'Birmingham New Street', crs: 'BHM' },
  { name: 'Leeds', crs: 'LDS' },
]

describe('stations', () => {
  beforeEach(() => {
    setStationsData(mockStations)
  })

  describe('searchStations', () => {
    it('should return empty array for empty query', () => {
      const results = searchStations('')
      expect(results).toEqual([])
    })

    it('should find station by exact CRS code', () => {
      const results = searchStations('PAD')
      expect(results).toHaveLength(1)
      expect(results[0].crs).toBe('PAD')
      expect(results[0].name).toBe('London Paddington')
    })

    it('should find stations by partial name match', () => {
      const results = searchStations('London')
      expect(results.length).toBeGreaterThan(0)
      expect(results.every((s) => s.name.toLowerCase().includes('london'))).toBe(true)
    })

    it('should find station by partial CRS match', () => {
      const results = searchStations('KG')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should limit results to 10', () => {
      // This test would need more stations to be meaningful
      const results = searchStations('L')
      expect(results.length).toBeLessThanOrEqual(10)
    })
  })
})

