import { calculateDelay, formatDelayMessage } from '../delay-calc'

describe('delay-calc', () => {
  describe('calculateDelay', () => {
    it('should return 0% compensation for delays under 15 minutes', () => {
      const scheduled = '2024-01-01T10:00:00Z'
      const actual = '2024-01-01T10:10:00Z' // 10 minutes late

      const result = calculateDelay(scheduled, actual)

      expect(result.delayMinutes).toBe(10)
      expect(result.compensationPercentage).toBe(0)
    })

    it('should return 25% compensation for 15-29 minute delays', () => {
      const scheduled = '2024-01-01T10:00:00Z'
      const actual = '2024-01-01T10:20:00Z' // 20 minutes late

      const result = calculateDelay(scheduled, actual)

      expect(result.delayMinutes).toBe(20)
      expect(result.compensationPercentage).toBe(25)
      expect(result.compensationType).toBe('single')
    })

    it('should return 50% compensation for 30-59 minute delays', () => {
      const scheduled = '2024-01-01T10:00:00Z'
      const actual = '2024-01-01T10:45:00Z' // 45 minutes late

      const result = calculateDelay(scheduled, actual)

      expect(result.delayMinutes).toBe(45)
      expect(result.compensationPercentage).toBe(50)
      expect(result.compensationType).toBe('single')
    })

    it('should return 100% single fare compensation for 60-119 minute delays', () => {
      const scheduled = '2024-01-01T10:00:00Z'
      const actual = '2024-01-01T11:30:00Z' // 90 minutes late

      const result = calculateDelay(scheduled, actual)

      expect(result.delayMinutes).toBe(90)
      expect(result.compensationPercentage).toBe(100)
      expect(result.compensationType).toBe('single')
    })

    it('should return 100% return fare compensation for 120+ minute delays', () => {
      const scheduled = '2024-01-01T10:00:00Z'
      const actual = '2024-01-01T12:30:00Z' // 150 minutes late

      const result = calculateDelay(scheduled, actual)

      expect(result.delayMinutes).toBe(150)
      expect(result.compensationPercentage).toBe(100)
      expect(result.compensationType).toBe('return')
    })
  })

  describe('formatDelayMessage', () => {
    it('should format message for delays under 15 minutes', () => {
      const delayInfo = {
        scheduledArrival: '2024-01-01T10:00:00Z',
        actualArrival: '2024-01-01T10:10:00Z',
        delayMinutes: 10,
        compensationPercentage: 0,
        compensationType: 'single' as const,
      }

      const message = formatDelayMessage(delayInfo)

      expect(message).toContain('10 minutes late')
      expect(message).toContain('No compensation')
    })

    it('should format message for compensable delays', () => {
      const delayInfo = {
        scheduledArrival: '2024-01-01T10:00:00Z',
        actualArrival: '2024-01-01T10:45:00Z',
        delayMinutes: 45,
        compensationPercentage: 50,
        compensationType: 'single' as const,
      }

      const message = formatDelayMessage(delayInfo)

      expect(message).toContain('45 minutes late')
      expect(message).toContain('50%')
      expect(message).toContain('single fare')
    })

    it('should format message for return fare compensation', () => {
      const delayInfo = {
        scheduledArrival: '2024-01-01T10:00:00Z',
        actualArrival: '2024-01-01T12:30:00Z',
        delayMinutes: 150,
        compensationPercentage: 100,
        compensationType: 'return' as const,
      }

      const message = formatDelayMessage(delayInfo)

      expect(message).toContain('150 minutes late')
      expect(message).toContain('100%')
      expect(message).toContain('return fare')
    })
  })
})

