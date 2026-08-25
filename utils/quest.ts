import type { Quest } from "../types/quest"

function getDifferentQuest(quests: Quest[], currentQuest: Quest): Quest {
    let newIndex = Math.floor(Math.random() * quests.length)

    while (quests[newIndex].id === currentQuest.id) {
        newIndex = Math.floor(Math.random() * quests.length)
    }
    return quests[newIndex]
}

export default getDifferentQuest
