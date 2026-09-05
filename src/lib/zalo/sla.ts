export interface SLACheckResult {
  elapsedSeconds: number
  targetSeconds: number
  isBreached: boolean
  warningLevel: 'NORMAL' | 'WARNING' | 'CRITICAL'
  formattedElapsed: string
}

export const SLA_CONFIG = {
  WORK_HOURS_START: 8, // 08:00
  WORK_HOURS_END: 19, // 19:00
  WORK_HOURS_TARGET_SEC: 300, // 5 phút = 300s
  OFF_HOURS_TARGET_SEC: 900, // 15 phút = 900s
  CONFIRM_TARGET_SEC: 1200, // 20 phút chốt lịch
}

export function isWorkHours(date: Date = new Date()): boolean {
  const hour = date.getHours()
  return hour >= SLA_CONFIG.WORK_HOURS_START && hour < SLA_CONFIG.WORK_HOURS_END
}

export function calculateSLA(firstMessageAt: Date, firstResponseAt?: Date | null): SLACheckResult {
  const isWork = isWorkHours(firstMessageAt)
  const targetSeconds = isWork ? SLA_CONFIG.WORK_HOURS_TARGET_SEC : SLA_CONFIG.OFF_HOURS_TARGET_SEC
  
  const endTime = firstResponseAt ? new Date(firstResponseAt).getTime() : Date.now()
  const startTime = new Date(firstMessageAt).getTime()
  const elapsedSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000))

  const isBreached = elapsedSeconds > targetSeconds

  let warningLevel: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL'
  if (isBreached) {
    warningLevel = 'CRITICAL'
  } else if (elapsedSeconds >= targetSeconds * 0.6) {
    // 60% thời gian trôi qua -> cảnh báo vàng
    warningLevel = 'WARNING'
  }

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formattedElapsed = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return {
    elapsedSeconds,
    targetSeconds,
    isBreached,
    warningLevel,
    formattedElapsed,
  }
}
