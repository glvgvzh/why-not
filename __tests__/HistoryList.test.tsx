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
})
