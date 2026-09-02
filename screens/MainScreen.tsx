import { styles } from "../styles/mainScreen"
import { BlurView } from 'expo-blur';
import { Text, Pressable } from "react-native"
import QuestCard from "../components/QuestCard";
import type { DailyQuest } from "../types/quest";

type MainScreenProps = {
    dailyQuest: DailyQuest;
    completeQuest: () => void;
    changeQuest: () => void;
    onOpenHistory: () => void;
}

function MainScreen({ dailyQuest, completeQuest, changeQuest, onOpenHistory }: MainScreenProps) {
    return (
        <>
            <Text style={styles.appTitle}>WhyNot?</Text>

            <BlurView intensity={30} style={dailyQuest.status === 'active' ? styles.activeQuestCard : styles.completedQuestCard}>
                <QuestCard currentQuest={dailyQuest.quest} status={dailyQuest.status} completeQuest={completeQuest} changeQuest={changeQuest} />
            </BlurView>

            <BlurView intensity={30} style={styles.historyButtonBlur}>
                <Pressable onPress={onOpenHistory} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>История</Text>
                </Pressable>
            </BlurView>
        </>
    )
}

export default MainScreen
