import { DelayInfo } from '../types'

export function calculateDelay(
  scheduledArrival: string,
  actualArrival: string
): DelayInfo {
  const scheduled = new Date(scheduledArrival)
  const actual = new Date(actualArrival)
  const delayMs = actual.getTime() - scheduled.getTime()
  const delayMinutes = Math.floor(delayMs / (1000 * 60))

  let compensationPercentage = 0
  let compensationType: 'single' | 'return' = 'single'

  if (delayMinutes >= 120) {
    compensationPercentage = 100
    compensationType = 'return'
  } else if (delayMinutes >= 60) {
    compensationPercentage = 100
    compensationType = 'single'
  } else if (delayMinutes >= 30) {
    compensationPercentage = 50
    compensationType = 'single'
  } else if (delayMinutes >= 15) {
    compensationPercentage = 25
    compensationType = 'single'
  }

  return {
    scheduledArrival,
    actualArrival,
    delayMinutes,
    compensationPercentage,
    compensationType,
  }
}

export function formatDelayMessage(delayInfo: DelayInfo): string {
  if (delayInfo.delayMinutes < 15) {
    return `Your train was ${delayInfo.delayMinutes} minutes late. No compensation is due.`
  }

  const fareType =
    delayInfo.compensationType === 'return' ? 'return fare' : 'single fare'

  return `Your train was ${delayInfo.delayMinutes} minutes late. You're owed ~${delayInfo.compensationPercentage}% of your ${fareType}.`
}

