import { getDailyQuestFromStorage } from "../storage/dailyQuestStorage";
import { getHistoryFromStorage } from "../storage/historyStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate } from "../utils/dailyQuest";

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn()
}))

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

describe('getDailyQuestFromStorage', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('returns null on storage read error', async () => {
        mockedAsyncStorage.getItem.mockRejectedValue(new Error('storage failed'))
        const result = await getDailyQuestFromStorage()

        expect(result).toBeNull()
    })

    test('returns null for invalid JSON', async () => {
        mockedAsyncStorage.getItem.mockResolvedValue('id: 1, title: title, description: description')
        const result = await getDailyQuestFromStorage()

        expect(result).toBeNull()
    })

    test('returns null if the structure is incorrect', async () => {
        const savedDailyQuest = {
            quest: {
                id: '2',
                title: 'title2',
                description: 'description2',
            },
            date: formatDate(new Date()),
            status: 'active'
        }
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedDailyQuest))
        const result = await getDailyQuestFromStorage()

        expect(result).toBeNull()
    })

    test('returns null if the field is missing from the record', async () => {
        const savedDailyQuest = {
            quest: {
                id: 2,
                title: 'title2',
            },
            date: formatDate(new Date()),
            status: 'active'
        }
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedDailyQuest))
        const result = await getDailyQuestFromStorage()

        expect(result).toBeNull()
    })

    test('returns valid DailyQuest', async () => {
        const savedDailyQuest = {
            quest: {
                id: 2,
                title: 'title2',
                description: 'description2',
            },
            date: formatDate(new Date()),
            status: 'active'
        }
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedDailyQuest))
        const result = await getDailyQuestFromStorage()

        expect(result).toStrictEqual(savedDailyQuest)
    })
})

describe('getHistoryFromStorage', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('returns empty array on storage read error', async () => {
        mockedAsyncStorage.getItem.mockRejectedValue(new Error('storage failed'))
        const result = await getHistoryFromStorage()

        expect(result).toStrictEqual([])
    })

    test('returns empty array for invalid JSON', async () => {
        mockedAsyncStorage.getItem.mockResolvedValue('id: 1, title: title, description: description')
        const result = await getHistoryFromStorage()

        expect(result).toStrictEqual([])
    })

    test('returns empty array if the structure is incorrect', async () => {
        const savedHistory = [
            {
                date: '2026-09-10',
                status: 'banana',
            },
            {
                quest: {
                    id: 1,
                    title: 'title',
                    description: 'description',
                },
                date: '2026-09-11',
                status: 'missed'
            }
        ]
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedHistory))
        const result = await getHistoryFromStorage()

        expect(result).toStrictEqual([])
    })

    test('returns empty array if the field is missing from the record', async () => {
        const savedHistory = [
            {
                date: '2026-09-10',
            },
            {
                quest: {
                    id: 1,
                    title: 'title',
                    description: 'description',
                },
                date: '2026-09-11',
                status: 'missed'
            }
        ]
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedHistory))
        const result = await getHistoryFromStorage()

        expect(result).toStrictEqual([])
    })

    test('returns valid history', async () => {
        const savedHistory = [
            {
                date: '2026-09-10',
                status: 'missed',
            },
            {
                quest: {
                    id: 1,
                    title: 'title',
                    description: 'description',
                },
                date: '2026-09-11',
                status: 'completed'
            }
        ]
        mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedHistory))
        const result = await getHistoryFromStorage()

        expect(result).toStrictEqual(savedHistory)
    })
})
