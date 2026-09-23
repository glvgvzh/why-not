import type { Quest } from '../types/quest'

export function getDifferentQuest(quests: Quest[], currentQuest: Quest): Quest | null {
  if (quests.length === 0) {
    return null
  }

  if (quests.length === 1) {
    if (quests[0].id === currentQuest.id) {
      return null
    }
    return quests[0]
  }

  let newIndex = Math.floor(Math.random() * quests.length)

  while (quests[newIndex].id === currentQuest.id) {
    newIndex = Math.floor(Math.random() * quests.length)
  }
  return quests[newIndex]
}

export function selectQuestForNewDay(
  availableQuests: Quest[],
  allQuests: Quest[],
  currentQuest: Quest,
): Quest {
  let newQuest = getDifferentQuest(availableQuests, currentQuest)
  if (newQuest === null) {
    newQuest = getDifferentQuest(allQuests, currentQuest)
    if (newQuest === null) {
      newQuest = allQuests[0]
    }
  }
  return newQuest
}
