import AsyncStorage from '@react-native-async-storage/async-storage'
import { isHistory, HistoryItem } from '../types/quest'

const HISTORY_STORAGE_KEY = 'history'

export async function setHistoryInStorage(history: HistoryItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.warn('Failed to save history in storage', error)
  }
}

export async function getHistoryFromStorage(): Promise<HistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY)
    if (data === null) {
      return []
    }
    const parsedData = JSON.parse(data)
    if (!isHistory(parsedData)) {
      return []
    }
    return parsedData
  } catch {
    return []
  }
}
