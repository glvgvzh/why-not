import { Pressable, Text } from 'react-native';
import { styles } from '../styles/mainScreen';
import type { Quest, DailyQuest } from '../types/quest';

type QuestCardProps = {
    currentQuest: Quest;
    status: DailyQuest['status'];
    completeQuest: () => void;
    changeQuest: () => void;
}

function QuestCard({ currentQuest, status, completeQuest, changeQuest }: QuestCardProps) {
    return (
        <>
            <Text style={styles.questLabel}>Опыт дня</Text>
            <Text style={styles.questTitle}>{currentQuest.title}</Text>
            <Text style={styles.questDescription}>{currentQuest.description}</Text>

            {status === 'active' &&
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

            {status === 'completed' &&
                <Text style={styles.completedText}>Выполнено</Text>
            }
        </>
    )
}

export default QuestCard
