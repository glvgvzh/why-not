import AsyncStorage from '@react-native-async-storage/async-storage'
import { isDailyQuest, DailyQuest } from '../types/quest'
import { DAILY_REPLACEMENT_LIMIT } from '../utils/dailyQuest'

const DAILY_QUEST_STORAGE_KEY = 'dailyQuest'

export async function setDailyQuestInStorage(dailyQuest: DailyQuest): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_QUEST_STORAGE_KEY, JSON.stringify(dailyQuest))
  } catch (error) {
    console.warn('Failed to save daily quest in storage', error)
  }
}

export async function getDailyQuestFromStorage(): Promise<DailyQuest | null> {
  try {
    const data = await AsyncStorage.getItem(DAILY_QUEST_STORAGE_KEY)
    if (data === null) {
      return null
    }
    let parsedData = JSON.parse(data)
    if (!('replacementsLeft' in parsedData)) {
      parsedData = { ...parsedData, replacementsLeft: DAILY_REPLACEMENT_LIMIT }
    }
    if (!isDailyQuest(parsedData)) {
      return null
    }
    return parsedData
  } catch {
    return null
  }
}
