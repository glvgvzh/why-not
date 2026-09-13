import type { DateString, DailyQuest, Quest, HistoryItem } from "../types/quest";
import { isDateChanged, formatDate, finalizeDailyQuest, excludeClosedQuests } from "../utils/dailyQuest";

describe('formatDate', () => {
    test('formats date with leading zeros', () => {
        const date: Date = new Date(2026, 0, 3)
        const formattedDate: DateString = formatDate(date)
        expect(formattedDate).toBe('2026-01-03')
    })

    test('formats date without leading zeros', () => {
        const date: Date = new Date(2026, 9, 30)
        const formattedDate: DateString = formatDate(date)
        expect(formattedDate).toBe('2026-10-30')
    })
})

describe('isDateChanged', () => {
    test('returns true for different dates', () => {
        const dailyQuestDate: DateString = '2026-01-03'
        const currentDate: DateString = '2026-03-30'
        expect(isDateChanged(dailyQuestDate, currentDate)).toBe(true)
    })

    test('returns false for the same date', () => {
        const dailyQuestDate: DateString = '2026-01-03'
        const currentDate: DateString = '2026-01-03'
        expect(isDateChanged(dailyQuestDate, currentDate)).toBe(false)
    })
})

describe('finalizeDailyQuest', () => {
    test('returns new missed status', () => {
        const dailyQuest: DailyQuest = {
            quest: {
                id: 1,
                title: 'name1',
                description: 'description1',
            },
            date: '2026-08-30',
            status: 'active',
        }
        const changedQuest: DailyQuest = finalizeDailyQuest(dailyQuest)

        expect(changedQuest.status).toBe('missed')
    })

    test('returns the same completed status', () => {
        const dailyQuest: DailyQuest = {
            quest: {
                id: 2,
                title: 'name2',
                description: 'description2',
            },
            date: '2026-08-30',
            status: 'completed',
        }
        const changedQuest: DailyQuest = finalizeDailyQuest(dailyQuest)

        expect(changedQuest.status).toBe('completed')
    })

    test('returns the same missed status', () => {
        const dailyQuest: DailyQuest = {
            quest: {
                id: 3,
                title: 'name3',
                description: 'description3',
            },
            date: '2026-08-30',
            status: 'missed',
        }
        const changedQuest: DailyQuest = finalizeDailyQuest(dailyQuest)

        expect(changedQuest.status).toBe('missed')
    })
})

describe('excludeClosedQuests', () => {
    test('removes right quests', () => {
        const quests: Quest[] = [
            {
                id: 1,
                title: 'title 1',
                description: 'description 1',
            },
            {
                id: 2,
                title: 'title 2',
                description: 'description 2',
            },
            {
                id: 3,
                title: 'title 3',
                description: 'description 3',
            },
            {
                id: 4,
                title: 'title 4',
                description: 'description 4',
            },
        ]
        const history: HistoryItem[] = [
            {
                quest: {
                    id: 1,
                    title: 'title 1',
                    description: 'description 1',
                },
                date: '2026-08-30',
                status: 'missed',
            },
            {
                quest: {
                    id: 4,
                    title: 'title 4',
                    description: 'description 4',
                },
                date: '2026-08-31',
                status: 'completed',
            },
            {
                date: '2026-09-01',
                status: 'missed',
            },
            {
                date: '2026-09-02',
                status: 'missed',
            },
        ]
        const availableQuests: Quest[] = excludeClosedQuests(quests, history)

        expect(availableQuests).toStrictEqual([
            {
                id: 2,
                title: 'title 2',
                description: 'description 2',
            },
            {
                id: 3,
                title: 'title 3',
                description: 'description 3',
            },
        ])
    })

    test('returns full array of quests when history empty', () => {
        const quests: Quest[] = [
            {
                id: 1,
                title: 'title 1',
                description: 'description 1',
            },
            {
                id: 2,
                title: 'title 2',
                description: 'description 2',
            },
            {
                id: 3,
                title: 'title 3',
                description: 'description 3',
            },
            {
                id: 4,
                title: 'title 4',
                description: 'description 4',
            },
        ]
        const history: HistoryItem[] = []
        const availableQuests: Quest[] = excludeClosedQuests(quests, history)

        expect(availableQuests).toStrictEqual([
            {
                id: 1,
                title: 'title 1',
                description: 'description 1',
            },
            {
                id: 2,
                title: 'title 2',
                description: 'description 2',
            },
            {
                id: 3,
                title: 'title 3',
                description: 'description 3',
            },
            {
                id: 4,
                title: 'title 4',
                description: 'description 4',
            },
        ])
    })

    test('returns empty array of quests when history full', () => {
        const quests: Quest[] = [
            {
                id: 1,
                title: 'title 1',
                description: 'description 1',
            },
            {
                id: 2,
                title: 'title 2',
                description: 'description 2',
            },
            {
                id: 3,
                title: 'title 3',
                description: 'description 3',
            },
            {
                id: 4,
                title: 'title 4',
                description: 'description 4',
            },
        ]
        const history: HistoryItem[] = [
            {
                quest: {
                    id: 1,
                    title: 'title 1',
                    description: 'description 1',
                },
                date: '2026-08-30',
                status: 'missed',
            },
            {
                quest: {
                    id: 2,
                    title: 'title 2',
                    description: 'description 2',
                },
                date: '2026-08-30',
                status: 'completed',
            },
            {
                quest: {
                    id: 3,
                    title: 'title 3',
                    description: 'description 3',
                },
                date: '2026-08-30',
                status: 'missed',
            },
            {
                quest: {
                    id: 4,
                    title: 'title 4',
                    description: 'description 4',
                },
                date: '2026-08-31',
                status: 'completed',
            },
        ]
        const availableQuests: Quest[] = excludeClosedQuests(quests, history)

        expect(availableQuests).toStrictEqual([])
    })
})
