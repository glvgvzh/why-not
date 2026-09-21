import { render, fireEvent } from '@testing-library/react-native'
import QuestCard from '../components/QuestCard'
import type { DailyQuest } from '../types/quest'

describe('QuestCard', () => {
    test('shows completed state', async () => {
        const dailyQuest: DailyQuest = {
            quest: {
                id: 1,
                title: 'Квест 1',
                description: 'Описание 1',
            },
            date: '2026-09-09',
            status: 'completed',
        }
        const { getByText, queryByText } = await render(
            <QuestCard
                dailyQuest={dailyQuest}
                completeQuest={() => { }}
                changeQuest={() => { }}
            />
        )

        expect(getByText('Выполнено')).toBeTruthy()
        expect(queryByText('Выполнить')).toBeNull()
        expect(queryByText('Заменить')).toBeNull()
    })

    test('calls completeQuest when complete button is pressed', async () => {
        const dailyQuest: DailyQuest = {
            quest: {
                id: 1,
                title: 'Квест 1',
                description: 'Описание 1',
            },
            date: '2026-09-09',
            status: 'active',
        }
        const completeQuest = jest.fn()
        const { getByText } = await render(
            <QuestCard
                dailyQuest={dailyQuest}
                completeQuest={completeQuest}
                changeQuest={() => { }}
            />
        )

        fireEvent.press(getByText('Выполнить'))
        expect(completeQuest).toHaveBeenCalledTimes(1)
    })
})
