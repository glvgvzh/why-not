import { styles } from "../styles/historyScreen";
import { Text, View } from 'react-native';
import type { HistoryItem } from "../types/quest"
import { BlurView } from "expo-blur";

type HistoryListProps = {
    history: HistoryItem[]
}

function HistoryList({ history }: HistoryListProps) {
    if (history.length === 0) {
        return <Text style={styles.emptyHistory}>История пока пуста</Text>
    }
    const sortedHistory: HistoryItem[] = [...history].sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))

    return (
        sortedHistory.map(historyItem => {
            return (
                <BlurView key={historyItem.date} intensity={30} style={historyItem.status === 'completed' ? styles.historyCardCompleted : styles.historyCardMissed}>
                    <View>
                        <Text style={styles.questDate}>{historyItem.date}</Text>
                        {historyItem.status === 'completed' &&
                            <>
                                <Text style={styles.questTitle}>{historyItem.quest.title}</Text>
                                <Text style={styles.questDescription}>{historyItem.quest.description}</Text>
                                <Text style={styles.completedText}>Выполнено</Text>
                            </>
                        }
                        {historyItem.status === 'missed' &&
                            <Text style={styles.missedText}>Пропущено</Text>
                        }
                    </View>
                </BlurView>
            )
        })
    )
}

export default HistoryList
