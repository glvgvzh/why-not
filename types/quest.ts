export type Quest = {
  id: number
  title: string
  description: string
}

export type DateString = `${number}-${number}-${number}`

export type BaseQuestData = {
  quest: Quest
  date: DateString
  status: 'active' | 'completed' | 'missed'
}

export type DailyQuest = BaseQuestData & {
  replacementsLeft: number
}

export type MissedDay = {
  date: DateString
  status: 'missed'
}

export type DayChangeResult = {
  dailyQuest: DailyQuest
  history: HistoryItem[]
}

export type HistoryItem = BaseQuestData | MissedDay

export function isBaseQuestData(value: unknown): value is BaseQuestData {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('quest' in value && 'date' in value && 'status' in value) ||
    typeof value.quest !== 'object' ||
    value.quest === null ||
    typeof value.date !== 'string' ||
    !(value.status === 'active' || value.status === 'completed' || value.status === 'missed') ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.date)
  ) {
    return false
  }
  if (!('id' in value.quest) || !('title' in value.quest) || !('description' in value.quest)) {
    return false
  }
  if (
    typeof value.quest.id !== 'number' ||
    typeof value.quest.title !== 'string' ||
    typeof value.quest.description !== 'string'
  ) {
    return false
  }
  return true
}

export function isDailyQuest(value: unknown): value is DailyQuest {
  return (
    isBaseQuestData(value) &&
    'replacementsLeft' in value &&
    typeof value.replacementsLeft === 'number'
  )
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if ('quest' in value) {
    return isBaseQuestData(value) && value.status !== 'active'
  }
  if (!('date' in value) || !('status' in value)) {
    return false
  }
  if (typeof value.date !== 'string' || typeof value.status !== 'string') {
    return false
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.date) || value.status !== 'missed') {
    return false
  }

  return true
}

export function isHistory(value: unknown): value is HistoryItem[] {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => isHistoryItem(item))
}
