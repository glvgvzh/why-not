import type { Quest } from '../types/quest'
import { getDifferentQuest, selectQuestForNewDay } from '../utils/quest'

describe('getDifferentQuest', () => {
  test('returns different quest', () => {
    const quests = [
      {
        id: 1,
        title: 'Квест 1',
        description: 'Описание 1',
      },
      {
        id: 2,
        title: 'Квест 2',
        description: 'Описание 2',
      },
      {
        id: 3,
        title: 'Квест 3',
        description: 'Описание 3',
      },
    ]
    const currentQuest = quests[0]
    const result = getDifferentQuest(quests, currentQuest)
    expect(result).not.toBe(null)
    expect(result?.id).not.toBe(currentQuest.id)
  })

  test('returns null if quests is empty', () => {
    const quests: Quest[] = []
    const currentQuest: Quest = {
      id: 1,
      title: 'title1',
      description: 'description1',
    }
    const result = getDifferentQuest(quests, currentQuest)
    expect(result).toBe(null)
  })

  test('returns null if current quest is the only item in quests', () => {
    const quests: Quest[] = [
      {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
    ]
    const currentQuest: Quest = {
      id: 1,
      title: 'title1',
      description: 'description1',
    }
    const result = getDifferentQuest(quests, currentQuest)
    expect(result).toBe(null)
  })

  test('returns another quest if another quest is the only item in quests', () => {
    const quests: Quest[] = [
      {
        id: 2,
        title: 'another quest',
        description: 'description2',
      },
    ]
    const currentQuest: Quest = {
      id: 1,
      title: 'title1',
      description: 'description1',
    }
    const result = getDifferentQuest(quests, currentQuest)
    expect(result).not.toBe(null)
    expect(result?.id).toBe(2)
  })
})

describe('selectQuestForNewDay', () => {
  test('starts a new cycle when available quests are exhausted', () => {
    const availableQuests: Quest[] = []
    const allQuests: Quest[] = [
      {
        id: 1,
        title: 'title1',
        description: 'description1',
      },
      {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
    ]
    const currentQuest: Quest = {
      id: 2,
      title: 'title2',
      description: 'description2',
    }
    const result: Quest = selectQuestForNewDay(availableQuests, allQuests, currentQuest)

    expect(result).not.toStrictEqual(currentQuest)
    expect(allQuests).toContainEqual(result)
  })

  test('returns current quest when it is the only quest in catalog', () => {
    const availableQuests: Quest[] = []
    const allQuests: Quest[] = [
      {
        id: 2,
        title: 'title2',
        description: 'description2',
      },
    ]
    const currentQuest: Quest = {
      id: 2,
      title: 'title2',
      description: 'description2',
    }
    const result: Quest = selectQuestForNewDay(availableQuests, allQuests, currentQuest)

    expect(result).toStrictEqual(currentQuest)
  })
})
