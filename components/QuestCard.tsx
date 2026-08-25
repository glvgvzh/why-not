import { Pressable, Text } from 'react-native';
import { styles } from '../styles/mainScreen';
import type { Quest } from '../types/quest';

type QuestCardProps = {
    currentQuest: Quest;
    isCompleted: boolean;
    completeQuest: () => void;
    changeQuest: () => void;
}

function QuestCard({ currentQuest, isCompleted, completeQuest, changeQuest }: QuestCardProps) {
    return (
        <>
            <Text style={styles.questLabel}>Опыт дня</Text>
            <Text style={styles.questTitle}>{currentQuest.title}</Text>
            <Text style={styles.questDescription}>{currentQuest.description}</Text>

            {!isCompleted &&
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

            {isCompleted &&
                <Text style={styles.completedText}>Выполнено</Text>
            }
        </>
    )
}

export default QuestCard
