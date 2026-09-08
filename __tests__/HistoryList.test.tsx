import HistoryList from "../components/HistoryList"
import { render } from "@testing-library/react-native"
import type { DailyQuest } from "../types/quest"

describe('HistoryList', () => {
    test('handles empty state', async () => {
        const history: DailyQuest[] = []
        const { getByText } = await render(
            <HistoryList history={history} />
        )
        expect(getByText('История пока пуста')).toBeTruthy()
    })

    test('status missed shows only date and status', async () => {
        const history: DailyQuest[] = [
            {
                quest: {
                    id: 1,
                    title: 'title1',
                    description: 'description1',
                },
                date: '2026-08-30',
                status: 'missed',
            }
        ]
        const { getByText, queryByText } = await render(
            <HistoryList history={history} />
        )
        expect(getByText('2026-08-30')).toBeTruthy()
        expect(getByText('Пропущено')).toBeTruthy()
        expect(queryByText('title1')).toBeNull()
        expect(queryByText('description1')).toBeNull()
    })

    test('status completed shows date, title, description, and status', async () => {
        const history: DailyQuest[] = [
            {
                quest: {
                    id: 2,
                    title: 'title2',
                    description: 'description2',
                },
                date: '2026-08-31',
                status: 'completed',
            }
        ]
        const { getByText } = await render(
            <HistoryList history={history} />
        )
        expect(getByText('2026-08-31')).toBeTruthy()
        expect(getByText('Выполнено')).toBeTruthy()
        expect(getByText('title2')).toBeTruthy()
        expect(getByText('description2')).toBeTruthy()
    })

    test('shows sorted history array', async () => {
        const history: DailyQuest[] = [
            {
                quest: {
                    id: 1,
                    title: 'title1',
                    description: 'description1',
                },
                date: '2026-09-30',
                status: 'completed',
            },
            {
                quest: {
                    id: 2,
                    title: 'title2',
                    description: 'description2',
                },
                date: '2027-08-31',
                status: 'completed',
            },
            {
                quest: {
                    id: 3,
                    title: 'title3',
                    description: 'description3',
                },
                date: '1999-08-31',
                status: 'completed',
            },
        ]
        const { getAllByText } = await render(
            <HistoryList history={history} />
        )
        const sortedHistoryDates = getAllByText(/\d{4}-\d{2}-\d{2}/)

        expect(history[0].date).toBe('2026-09-30')
        expect(history[1].date).toBe('2027-08-31')
        expect(history[2].date).toBe('1999-08-31')

        expect(sortedHistoryDates[0]).toHaveTextContent('2027-08-31')
        expect(sortedHistoryDates[1]).toHaveTextContent('2026-09-30')
        expect(sortedHistoryDates[2]).toHaveTextContent('1999-08-31')
    })
})
