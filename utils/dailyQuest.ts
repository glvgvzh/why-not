import type { DateString, DailyQuest, Quest } from "../types/quest"

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

export function excludeClosedQuests(quests: Quest[], history: DailyQuest[]): Quest[] {
    return quests.filter((quest: Quest) => !history.some((historyQuest: DailyQuest) => historyQuest.quest.id === quest.id))
}
