import AsyncStorage from '@react-native-async-storage/async-storage'
import App from '../App'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import type { DailyQuest, HistoryItem } from '../types/quest'
import { DAILY_REPLACEMENT_LIMIT, formatDate } from '../utils/dailyQuest'
import { AppState } from 'react-native'

jest.mock('@expo-google-fonts/manrope', () => ({
  useFonts: () => [true],
  Manrope_400Regular: {},
  Manrope_500Medium: {},
  Manrope_600SemiBold: {},
}))

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
)

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

jest.mock('expo-blur', () => ({
  BlurView: require('react-native').View,
}))

const appStateSpy = jest.spyOn(AppState, 'addEventListener').mockReturnValue({
  remove: jest.fn(),
})

afterAll(() => {
  appStateSpy.mockRestore()
})

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows loader until storage is loaded', async () => {
    mockedAsyncStorage.getItem.mockImplementation(() => new Promise(() => {}))
    const { queryByTestId, getByTestId } = await render(<App />)
    expect(getByTestId('loader')).toBeTruthy()
    expect(queryByTestId('mainScreen')).toBeNull()
  })

  test('shows main screen after storage is loaded', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null)
    const { queryByTestId, getByTestId } = await render(<App />)
    await waitFor(() => {
      expect(getByTestId('mainScreen')).toBeTruthy()
      expect(queryByTestId('loader')).toBeNull()
    })
  })

  test('shows saved active quest after storage is loaded', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 1,
    }
    const savedHistory: HistoryItem[] = [
      {
        date: '2026-09-13',
        status: 'missed',
      },
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-14',
        status: 'completed',
      },
    ]
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { queryByTestId, getByTestId, getByText } = await render(<App />)
    await waitFor(() => {
      expect(getByTestId('mainScreen')).toBeTruthy()
      expect(getByText('title2')).toBeTruthy()
      expect(getByText('description2')).toBeTruthy()
      expect(queryByTestId('loader')).toBeNull()
    })
  })

  test('shows saved completed quest after storage is loaded', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'completed',
      replacementsLeft: 1,
    }
    const savedHistory: HistoryItem[] = [
      {
        date: '2026-09-13',
        status: 'missed',
      },
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-14',
        status: 'completed',
      },
    ]
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { queryByTestId, getByTestId, queryByText, getByText } = await render(<App />)
    await waitFor(() => {
      expect(getByTestId('mainScreen')).toBeTruthy()
      expect(getByText('title2')).toBeTruthy()
      expect(getByText('description2')).toBeTruthy()
      expect(getByTestId('completedQuest')).toBeTruthy()
      expect(getByText('Выполнено')).toBeTruthy()

      expect(queryByTestId('loader')).toBeNull()
      expect(queryByText('Выполнить')).toBeNull()
      expect(queryByText('Заменить')).toBeNull()
    })
  })

  test('navigates from main screen to history and back', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null)
    const { getByText, findByTestId } = await render(<App />)
    expect(await findByTestId('mainScreen')).toBeTruthy()
    fireEvent.press(getByText('История'))
    expect(await findByTestId('historyScreen')).toBeTruthy()
    fireEvent.press(getByText('Назад'))
    expect(await findByTestId('mainScreen')).toBeTruthy()
  })

  test('shows empty history state', async () => {
    const savedHistory: HistoryItem[] = []
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { findByText } = await render(<App />)
    fireEvent.press(await findByText('История'))
    expect(await findByText('История пока пуста')).toBeTruthy()
  })

  test('shows completed quests count', async () => {
    const savedHistory: HistoryItem[] = [
      {
        date: '2026-09-13',
        status: 'missed',
      },
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-14',
        status: 'completed',
      },
      {
        quest: {
          id: 2,
          title: 'title2',
          description: 'description2',
        },
        date: '2026-09-15',
        status: 'completed',
      },
    ]
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { findByText } = await render(<App />)
    fireEvent.press(await findByText('История'))
    expect(await findByText('Выполнено: 2')).toBeTruthy()
  })

  test('does not show completed quests count for empty history', async () => {
    const savedHistory: HistoryItem[] = []
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { findByText, queryByText } = await render(<App />)
    fireEvent.press(await findByText('История'))
    await findByText('История пока пуста')
    expect(queryByText(/Выполнено:/i)).toBeNull()
  })

  test('completes quest and adds it to history', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 1,
    }
    const savedHistory: HistoryItem[] = []
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })
    const { findByText, queryByText, getByText } = await render(<App />)

    expect(await findByText('title2')).toBeTruthy()
    expect(getByText('description2')).toBeTruthy()
    expect(getByText('Выполнить')).toBeTruthy()
    expect(getByText('Заменить')).toBeTruthy()

    fireEvent.press(getByText('Выполнить'))

    expect(await findByText('Выполнено')).toBeTruthy()
    expect(queryByText('Выполнить')).toBeNull()
    expect(queryByText('Заменить')).toBeNull()

    fireEvent.press(getByText('История'))

    expect(await findByText('Выполнено: 1')).toBeTruthy()
    expect(getByText('title2')).toBeTruthy()
    expect(getByText('description2')).toBeTruthy()
  })

  test('saves completed quest and updated history to AsyncStorage', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 1,
    }
    const savedHistory: HistoryItem[] = []
    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      if (key === 'history') {
        return JSON.stringify(savedHistory)
      }
      return null
    })

    const { findByText } = await render(<App />)

    fireEvent.press(await findByText('Выполнить'))
    await waitFor(() => {
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'dailyQuest',
        JSON.stringify({ ...savedDailyQuest, status: 'completed' }),
      )
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'history',
        JSON.stringify([
          { quest: savedDailyQuest.quest, date: savedDailyQuest.date, status: 'completed' },
        ]),
      )
    })
  })

  test('decreases replacementsLeft after successful quest replacement', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 1,
    }

    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      return null
    })

    const { findByText } = await render(<App />)

    fireEvent.press(await findByText('Заменить'))
    await waitFor(() => {
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'dailyQuest',
        expect.stringContaining('"replacementsLeft":0'),
      )
    })
  })

  test('disables quest replacement after replacement attempt is used', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 1,
    }

    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      return null
    })

    const { findByText, queryByText, getByText, getByTestId } = await render(<App />)

    fireEvent.press(await findByText('Заменить'))
    await waitFor(() => {
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'dailyQuest',
        expect.stringContaining('"replacementsLeft":0'),
      )
      expect(queryByText('Заменить')).toBeNull()
      expect(getByText('Нет доступных квестов')).toBeTruthy()
      expect(getByTestId('changeButton')).toBeDisabled()
    })
  })

  test('restores used replacement limit after app restart', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      date: formatDate(new Date()),
      status: 'active',
      replacementsLeft: 0,
    }

    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      return null
    })

    const { queryByText, getByText, getByTestId } = await render(<App />)

    await waitFor(() => {
      expect(queryByText('Заменить')).toBeNull()
      expect(getByText('Нет доступных квестов')).toBeTruthy()
      expect(getByTestId('changeButton')).toBeDisabled()
    })
  })

  test('resets replacement limit on a new day', async () => {
    const savedDailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      date: '2026-09-22',
      status: 'active',
      replacementsLeft: 0,
    }

    mockedAsyncStorage.getItem.mockImplementation(async (key: string) => {
      if (key === 'dailyQuest') {
        return JSON.stringify(savedDailyQuest)
      }
      return null
    })

    const { getByText, getByTestId } = await render(<App />)

    await waitFor(() => {
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        'dailyQuest',
        expect.stringContaining(`"replacementsLeft":${DAILY_REPLACEMENT_LIMIT}`),
      )
      expect(getByText('Заменить')).toBeTruthy()
      expect(getByTestId('changeButton')).toBeEnabled()
    })
  })
})
