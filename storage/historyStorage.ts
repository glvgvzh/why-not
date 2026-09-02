import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyQuest } from '../types/quest';

const HISTORY_STORAGE_KEY = 'history'

export async function setHistoryInStorage(history: DailyQuest[]): Promise<void> {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
}

export async function getHistoryFromStorage(): Promise<DailyQuest[]> {
    const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY)
    if (data === null) {
        return []
    }
    return JSON.parse(data)
}
