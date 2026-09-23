import { setDailyQuestInStorage, getDailyQuestFromStorage } from '../storage/dailyQuestStorage'
import { setHistoryInStorage, getHistoryFromStorage } from '../storage/historyStorage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DAILY_REPLACEMENT_LIMIT, formatDate } from '../utils/dailyQuest'
import type { DailyQuest, HistoryItem } from '../types/quest'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  consoleWarnSpy.mockRestore()
})

describe('setDailyQuestInStorage', () => {
  test('warns when daily quest save fails', async () => {
    mockedAsyncStorage.setItem.mockRejectedValue(new Error('storage failed'))

    const dailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: DAILY_REPLACEMENT_LIMIT,
    }

    await setDailyQuestInStorage(dailyQuest)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to save daily quest in storage',
      expect.any(Error),
    )
  })
})

describe('getDailyQuestFromStorage', () => {
  test('returns null on storage read error', async () => {
    mockedAsyncStorage.getItem.mockRejectedValue(new Error('storage failed'))
    const result = await getDailyQuestFromStorage()

    expect(result).toBeNull()
  })

  test('keeps valid history when daily quest read fails', async () => {
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
        status: 'completed',
        replacementsLeft: DAILY_REPLACEMENT_LIMIT,
      },
    ]
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        throw new Error('storage read failed')
      }
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const dailyQuestResult = await getDailyQuestFromStorage()
    const historyResult = await getHistoryFromStorage()

    expect(dailyQuestResult).toBeNull()
    expect(historyResult).toStrictEqual(savedHistory)
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
      status: 'active',
      replacementsLeft: DAILY_REPLACEMENT_LIMIT,
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
      status: 'active',
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
      status: 'active',
      replacementsLeft: DAILY_REPLACEMENT_LIMIT,
    }
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedDailyQuest))
    const result = await getDailyQuestFromStorage()

    expect(result).toStrictEqual(savedDailyQuest)
  })

  test('returns valid DailyQuest from old format (without replacementsLeft) ', async () => {
    const savedDailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'active',
    }
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedDailyQuest))
    const result = await getDailyQuestFromStorage()

    expect(result).toStrictEqual({ ...savedDailyQuest, replacementsLeft: DAILY_REPLACEMENT_LIMIT })
  })
})

describe('setHistoryInStorage', () => {
  test('warns when history save fails', async () => {
    mockedAsyncStorage.setItem.mockRejectedValue(new Error('storage failed'))

    const history: HistoryItem[] = [
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
        status: 'completed',
      },
    ]

    await setHistoryInStorage(history)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to save history in storage',
      expect.any(Error),
    )
  })
})

describe('getHistoryFromStorage', () => {
  test('returns empty array on storage read error', async () => {
    mockedAsyncStorage.getItem.mockRejectedValue(new Error('storage failed'))
    const result = await getHistoryFromStorage()

    expect(result).toStrictEqual([])
  })

  test('keeps valid daily quest when history read fails', async () => {
    const savedDailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: DAILY_REPLACEMENT_LIMIT,
    }
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      if (key === 'history') {
        throw new Error('storage read failed')
      }
      return null
    })
    const dailyQuestResult = await getDailyQuestFromStorage()
    const historyResult = await getHistoryFromStorage()

    expect(dailyQuestResult).toStrictEqual(savedDailyQuest)
    expect(historyResult).toStrictEqual([])
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
        status: 'missed',
      },
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
        status: 'missed',
      },
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
        status: 'completed',
      },
    ]
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(savedHistory))
    const result = await getHistoryFromStorage()

    expect(result).toStrictEqual(savedHistory)
  })
})
