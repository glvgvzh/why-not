import { styles } from "../styles/historyScreen";
import { Text, View } from 'react-native';
import type { DailyQuest } from "../types/quest"

type HistoryListProps = {
    history: DailyQuest[]
}

function HistoryList({ history }: HistoryListProps) {
    if (history.length === 0) {
        return (
            <Text style={styles.emptyHistory}>История пока пуста</Text>
        )
    }
    return (
        history.map(historyItem => {
            if (historyItem.status === 'completed') {
                return (
                    <View key={historyItem.date}>
                        <Text>{historyItem.date}</Text>
                        <Text>{historyItem.quest.title}</Text>
                        <Text>{historyItem.quest.description}</Text>
                        <Text>Выполнено</Text>
                    </View>
                )
            } else if (historyItem.status === 'missed') {
                return (
                    <View key={historyItem.date}>
                        <Text>{historyItem.date}</Text>
                        <Text>Пропущено</Text>
                    </View>
                )
            }
            return null
        })
    )
}

export default HistoryList
