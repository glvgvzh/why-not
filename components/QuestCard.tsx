import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles/mainScreen';
import type { DailyQuest } from '../types/quest';
import { formatDateForUI } from '../utils/dailyQuest';

type QuestCardProps = {
    dailyQuest: DailyQuest;
    completeQuest: () => void;
    changeQuest: () => void;
}

function QuestCard({ dailyQuest, completeQuest, changeQuest }: QuestCardProps) {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.questLabel}>Опыт дня</Text>
                <Text style={styles.questLabel}>{formatDateForUI(dailyQuest.date)}</Text>
            </View>
            <Text style={styles.questTitle}>{dailyQuest.quest.title}</Text>
            <Text style={styles.questDescription}>{dailyQuest.quest.description}</Text>

            {dailyQuest.status === 'active' &&
                <>
                    <Pressable
                        style={styles.primaryButton}
                        onPress={completeQuest}
                    >
                        <Text style={styles.primaryButtonText}>Выполнить</Text>
                    </Pressable>

                    <Pressable
                        style={styles.secondaryButton}
                        onPress={changeQuest}
                    >
                        <Text style={styles.secondaryButtonText}>Заменить</Text>
                    </Pressable>
                </>
            }

            {dailyQuest.status === 'completed' &&
                <Text style={styles.completedText} testID='completedQuest'>Выполнено</Text>
            }
        </>
    )
}

export default QuestCard
