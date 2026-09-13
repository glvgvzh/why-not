import type { DateString, DailyQuest, Quest, HistoryItem } from "../types/quest"

export function isDateChanged(dailyQuestDate: DateString, currentDate: DateString): boolean {
    return dailyQuestDate !== currentDate
}

export function formatDate(date: Date): DateString {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}` as DateString
}

export function finalizeDailyQuest(dailyQuest: DailyQuest): DailyQuest {
    if (dailyQuest.status === 'active') {
        return { ...dailyQuest, status: 'missed' }
    }
    return dailyQuest
}

export function excludeClosedQuests(quests: Quest[], history: HistoryItem[]): Quest[] {
    return quests.filter((quest: Quest) => !history.some((historyQuest: HistoryItem) => 'quest' in historyQuest && historyQuest.quest.id === quest.id))
}
