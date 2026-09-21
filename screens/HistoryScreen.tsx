import { Text, Pressable, View, ScrollView } from "react-native";
import type { HistoryItem } from "../types/quest";
import HistoryList from "../components/HistoryList";
import { styles } from "../styles/historyScreen";

type HistoryScreenProps = {
    history: HistoryItem[];
    onBack: () => void;
}

function HistoryScreen({ history, onBack }: HistoryScreenProps) {
    const completedQuestsCount: number = history.reduce((acc, historyItem) => {
        if (historyItem.status === 'completed') {
            acc++
        }
        return acc
    }, 0)

    return (
        <>
            <View style={styles.container} testID="historyScreen">
                <Text style={styles.title}>История</Text>
                {history.length > 0 &&
                    <Text style={styles.completedQuestsCount}>Выполнено: {completedQuestsCount}</Text>
                }
                <ScrollView style={styles.mainPart}>
                    <HistoryList history={history} />
                </ScrollView>
                <Pressable
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>Назад</Text>
                </Pressable>
            </View>
        </>
    )
}

export default HistoryScreen
