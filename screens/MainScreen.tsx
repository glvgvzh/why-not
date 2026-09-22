import { styles } from "../styles/mainScreen"
import { BlurView } from 'expo-blur';
import { Text, Pressable, View } from "react-native"
import QuestCard from "../components/QuestCard";
import type { DailyQuest } from "../types/quest";

type MainScreenProps = {
    dailyQuest: DailyQuest;
    completeQuest: () => void;
    changeQuest: () => void;
    onOpenHistory: () => void;
    canReplaceQuest: boolean;
}

function MainScreen({ dailyQuest, completeQuest, changeQuest, onOpenHistory, canReplaceQuest }: MainScreenProps) {
    return (
        <View style={styles.container} testID="mainScreen">
            <Text style={styles.appTitle}>WhyNot?</Text>

            <BlurView intensity={30} style={dailyQuest.status === 'active' ? styles.activeQuestCard : styles.completedQuestCard}>
                <QuestCard dailyQuest={dailyQuest} completeQuest={completeQuest} changeQuest={changeQuest} canReplaceQuest={canReplaceQuest} />
            </BlurView>

            <BlurView intensity={30} style={styles.historyButtonBlur}>
                <Pressable onPress={onOpenHistory} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>История</Text>
                </Pressable>
            </BlurView>
        </View>
    )
}

export default MainScreen
