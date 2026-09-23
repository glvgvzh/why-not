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
      replacementsLeft: 1,
    }
    const { getByText, queryByText } = await render(
      <QuestCard
        dailyQuest={dailyQuest}
        completeQuest={() => {}}
        changeQuest={() => {}}
        canReplaceQuest={true}
      />,
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
      replacementsLeft: 1,
    }
    const completeQuest = jest.fn()
    const { getByText } = await render(
      <QuestCard
        dailyQuest={dailyQuest}
        completeQuest={completeQuest}
        changeQuest={() => {}}
        canReplaceQuest={true}
      />,
    )

    fireEvent.press(getByText('Выполнить'))
    expect(completeQuest).toHaveBeenCalledTimes(1)
  })

  test('calls changeQuest when change button is pressed', async () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'Квест 1',
        description: 'Описание 1',
      },
      date: '2026-09-09',
      status: 'active',
      replacementsLeft: 1,
    }
    const changeQuest = jest.fn()
    const { getByText } = await render(
      <QuestCard
        dailyQuest={dailyQuest}
        completeQuest={() => {}}
        changeQuest={changeQuest}
        canReplaceQuest={true}
      />,
    )

    fireEvent.press(getByText('Заменить'))
    expect(changeQuest).toHaveBeenCalledTimes(1)
  })

  test('shows formatted date in quest card', async () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'Квест 1',
        description: 'Описание 1',
      },
      date: '2026-09-09',
      status: 'active',
      replacementsLeft: 1,
    }
    const { getByText, queryByText } = await render(
      <QuestCard
        dailyQuest={dailyQuest}
        completeQuest={() => {}}
        changeQuest={() => {}}
        canReplaceQuest={true}
      />,
    )
    expect(getByText('09.09.2026')).toBeTruthy()
    expect(queryByText('2026-09-09')).toBeNull()
  })

  test('shows disabled change button', async () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 1,
        title: 'Квест 1',
        description: 'Описание 1',
      },
      date: '2026-09-09',
      status: 'active',
      replacementsLeft: 1,
    }
    const { getByText, queryByText, getByTestId } = await render(
      <QuestCard
        dailyQuest={dailyQuest}
        completeQuest={() => {}}
        changeQuest={() => {}}
        canReplaceQuest={false}
      />,
    )
    expect(queryByText('Заменить')).toBeNull()
    expect(getByText('Нет доступных квестов')).toBeTruthy()
    expect(getByTestId('changeButton')).toBeDisabled()
  })
})
