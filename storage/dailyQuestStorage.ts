import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyQuest } from '../types/quest';

const DAILY_QUEST_STORAGE_KEY = 'dailyQuest'

export function isDailyQuest(value: unknown): value is DailyQuest {
    if (typeof value !== 'object'
        || value === null
        || !('quest' in value && 'date' in value && 'status' in value)
        || typeof value.quest !== 'object'
        || value.quest === null
        || typeof value.date !== 'string'
        || !(value.status === 'active' || value.status === 'completed' || value.status === 'missed')
        || !/^\d{4}-\d{2}-\d{2}$/.test(value.date)
    ) {
        return false
    }
    if (!('id' in value.quest)
        || !('title' in value.quest)
        || !('description' in value.quest)
    ) {
        return false
    }
    if (typeof value.quest.id !== 'number'
        || typeof value.quest.title !== 'string'
        || typeof value.quest.description !== 'string'
    ) {
        return false
    }
    return true
}

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
        const parsedData = JSON.parse(data)
        if (!isDailyQuest(parsedData)) {
            return null
        }
        return parsedData
    } catch {
        return null
    }
}
