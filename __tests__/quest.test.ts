import getDifferentQuest from "../utils/quest"

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
        expect(result.id).not.toBe(currentQuest.id)
    })
})

