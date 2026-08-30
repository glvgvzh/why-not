import { render, fireEvent } from '@testing-library/react-native'
import QuestCard from '../components/QuestCard'

describe('QuestCard', () => {
    test('shows completed state', async () => {
        const quest = {
            id: 1,
            title: 'Квест 1',
            description: 'Описание 1',
        }
        const { getByText, queryByText } = await render(
            <QuestCard
                currentQuest={quest}
                status='completed'
                completeQuest={() => { }}
                changeQuest={() => { }}
            />
        )

        expect(getByText('Выполнено')).toBeTruthy()
        expect(queryByText('Выполнить')).toBeNull()
        expect(queryByText('Заменить')).toBeNull()
    })

    test('calls completeQuest when complete button is pressed', async () => {
        const quest = {
            id: 1,
            title: 'Квест 1',
            description: 'Описание 1',
        }
        const completeQuest = jest.fn()
        const { getByText } = await render(
            <QuestCard
                currentQuest={quest}
                status='active'
                completeQuest={completeQuest}
                changeQuest={() => { }}
            />
        )

        fireEvent.press(getByText('Выполнить'))
        expect(completeQuest).toHaveBeenCalledTimes(1)
    })
})
