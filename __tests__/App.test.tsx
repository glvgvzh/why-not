import AsyncStorage from "@react-native-async-storage/async-storage";
import App from "../App";
import { render, waitFor } from "@testing-library/react-native";
import type { DailyQuest, HistoryItem } from "../types/quest";
import { formatDate } from "../utils/dailyQuest";
import { AppState } from "react-native";

jest.mock('@expo-google-fonts/manrope', () => ({
    useFonts: () => [true],
    Manrope_400Regular: {},
    Manrope_500Medium: {},
    Manrope_600SemiBold: {},
}))

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default)

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn()
}))

const appStateSpy = jest.spyOn(AppState, 'addEventListener').mockReturnValue({
    remove: jest.fn()
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
        mockedAsyncStorage.getItem.mockImplementation(() => new Promise(() => { }))
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
})
