import type { DateString, DailyQuest, Quest, HistoryItem, BaseQuestData } from '../types/quest'
import {
  isDateChanged,
  formatDate,
  finalizeDailyQuest,
  excludeClosedQuests,
  getMissedDays,
  handleDayChange,
  formatDateForUI,
} from '../utils/dailyQuest'

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
      replacementsLeft: 1,
    }
    const changedQuest: BaseQuestData = finalizeDailyQuest(dailyQuest)

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
      replacementsLeft: 1,
    }
    const changedQuest: BaseQuestData = finalizeDailyQuest(dailyQuest)

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
      replacementsLeft: 1,
    }
    const changedQuest: BaseQuestData = finalizeDailyQuest(dailyQuest)

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

describe('getMissedDays', () => {
  test('returns missed days', () => {
    const firstDate: DateString = '2026-09-01'
    const currentDate: DateString = '2026-09-05'
    expect(getMissedDays(firstDate, currentDate)).toStrictEqual([
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
    ])
  })

  test('returns empty array', () => {
    const firstDate: DateString = '2026-09-01'
    const currentDate: DateString = '2026-09-02'
    expect(getMissedDays(firstDate, currentDate)).toStrictEqual([])
  })

  test('returns missed days with changed month', () => {
    const firstDate: DateString = '2026-09-29'
    const currentDate: DateString = '2026-10-02'
    expect(getMissedDays(firstDate, currentDate)).toStrictEqual(['2026-09-30', '2026-10-01'])
  })

  test('returns missed days with changed year', () => {
    const firstDate: DateString = '2026-12-29'
    const currentDate: DateString = '2027-01-03'
    expect(getMissedDays(firstDate, currentDate)).toStrictEqual([
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
    ])
  })
})

describe('handleDayChange', () => {
  test('returns the same dailyQuest & history if the day has not changed', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-17',
      status: 'active',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = [
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-16',
        status: 'missed',
      },
    ]
    const currentDate: DateString = '2026-09-17'
    const result = handleDayChange(dailyQuest, history, currentDate)
    expect(result.dailyQuest).toBe(dailyQuest)
    expect(result.history).toBe(history)
  })

  test('returns new dailyQuest & history if the day has changed to next day', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-17',
      status: 'active',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = [
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-16',
        status: 'missed',
      },
    ]
    const currentDate: DateString = '2026-09-18'
    const result = handleDayChange(dailyQuest, history, currentDate)
    expect(result.dailyQuest.date).toBe('2026-09-18')
    expect(result.dailyQuest.status).toBe('active')
    expect(result.history).toStrictEqual([
      ...history,
      { quest: dailyQuest.quest, date: dailyQuest.date, status: 'missed' },
    ])
  })

  test('returns new dailyQuest & new missed days in history if a few days have passed', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-17',
      status: 'active',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = [
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-16',
        status: 'missed',
      },
    ]
    const currentDate: DateString = '2026-09-20'
    const result = handleDayChange(dailyQuest, history, currentDate)
    expect(result.dailyQuest.date).toBe('2026-09-20')
    expect(result.dailyQuest.status).toBe('active')
    expect(result.history).toStrictEqual([
      ...history,
      {
        quest: dailyQuest.quest,
        date: dailyQuest.date,
        status: 'missed',
      },
      {
        date: '2026-09-18',
        status: 'missed',
      },
      {
        date: '2026-09-19',
        status: 'missed',
      },
    ])
  })

  test('a completed quest does not turn into a missed one', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-17',
      status: 'completed',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = [
      {
        quest: {
          id: 1,
          title: 'title1',
          description: 'description1',
        },
        date: '2026-09-16',
        status: 'completed',
      },
      {
        quest: {
          id: 2,
          title: 'title2',
          description: 'description2',
        },
        date: '2026-09-17',
        status: 'completed',
      },
    ]
    const currentDate: DateString = '2026-09-18'
    const result = handleDayChange(dailyQuest, history, currentDate)
    expect(result.dailyQuest.date).toBe('2026-09-18')
    expect(result.dailyQuest.status).toBe('active')
    expect(result.history).toStrictEqual(history)
  })

  test('does not add duplicate dates to history', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-17',
      status: 'completed',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = [
      {
        date: '2026-09-18',
        status: 'missed',
      },
    ]
    const currentDate: DateString = '2026-09-20'
    const result = handleDayChange(dailyQuest, history, currentDate)
    const duplicates = result.history.filter((item) => item.date === '2026-09-18')
    expect(duplicates).toHaveLength(1)
    expect(result.history.some((item) => item.date === '2026-09-19')).toBe(true)
    expect(result.dailyQuest.date).toBe('2026-09-20')
    expect(result.dailyQuest.status).toBe('active')
  })

  test('handles day change across month boundary', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-09-29',
      status: 'active',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = []
    const currentDate: DateString = '2026-10-02'
    const result = handleDayChange(dailyQuest, history, currentDate)

    expect(result.dailyQuest.date).toBe('2026-10-02')
    expect(result.dailyQuest.status).toBe('active')
    expect(result.history).toStrictEqual([
      {
        quest: {
          id: 2,
          title: 'title2',
          description: 'description2',
        },
        date: '2026-09-29',
        status: 'missed',
      },
      {
        date: '2026-09-30',
        status: 'missed',
      },
      {
        date: '2026-10-01',
        status: 'missed',
      },
    ])
  })

  test('handles day change across year boundary', () => {
    const dailyQuest: DailyQuest = {
      quest: {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
      date: '2026-12-29',
      status: 'active',
      replacementsLeft: 1,
    }
    const history: HistoryItem[] = []
    const currentDate: DateString = '2027-01-02'
    const result = handleDayChange(dailyQuest, history, currentDate)

    expect(result.dailyQuest.date).toBe('2027-01-02')
    expect(result.dailyQuest.status).toBe('active')
    expect(result.history).toStrictEqual([
      {
        quest: {
          id: 2,
          title: 'title2',
          description: 'description2',
        },
        date: '2026-12-29',
        status: 'missed',
      },
      {
        date: '2026-12-30',
        status: 'missed',
      },
      {
        date: '2026-12-31',
        status: 'missed',
      },
      {
        date: '2027-01-01',
        status: 'missed',
      },
    ])
  })
})

describe('formatDateForUI', () => {
  test('formats date from YYYY-MM-DD to DD.MM.YYYY', () => {
    const date: DateString = '2026-09-21'
    const formattedDate = formatDateForUI(date)
    expect(formattedDate).toBe('21.09.2026')
  })
})
