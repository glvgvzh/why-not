import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryItem } from '../types/quest';
import { isDailyQuest } from './dailyQuestStorage';

const HISTORY_STORAGE_KEY = 'history'

function isHistoryItem(value: unknown): value is HistoryItem {
    if (typeof value !== 'object' || value === null) {
        return false
    }
    if ('quest' in value) {
        return isDailyQuest(value)
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

function isHistory(value: unknown): value is HistoryItem[] {
    if (!Array.isArray(value)) {
        return false
    }

    return value.every(item => isHistoryItem(item))
}

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
