import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyQuest } from '../types/quest';

const DAILY_QUEST_STORAGE_KEY = 'dailyQuest'

export async function setDailyQuestInStorage(dailyQuest: DailyQuest): Promise<void> {
    await AsyncStorage.setItem(DAILY_QUEST_STORAGE_KEY, JSON.stringify(dailyQuest))
}

export async function getDailyQuestFromStorage(): Promise<DailyQuest | null> {
    const data = await AsyncStorage.getItem(DAILY_QUEST_STORAGE_KEY)
    if (data === null) {
        return null
    }
    return JSON.parse(data)
}
