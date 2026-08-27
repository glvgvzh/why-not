import { styles } from './styles/mainScreen';
import { StatusBar } from 'expo-status-bar';
import { Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useState } from 'react';
import getDifferentQuest from './utils/quest';
import { quests } from './data/quests';

import QuestCard from './components/QuestCard';

export default function App() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  })

  const [currentQuest, setCurrentQuest] = useState(quests[0])
  const [isCompleted, setIsCompleted] = useState(false)

  function changeQuest(): void {
    const newQuest = getDifferentQuest(quests, currentQuest)
    setCurrentQuest(newQuest)
  }

  function completeQuest(): void {
    setIsCompleted(true)
  }

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('./assets/background1.jpg')}
      style={styles.container}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.appTitle}>WhyNot?</Text>

        <BlurView intensity={30} style={!isCompleted ? styles.activeQuestCard : styles.completedQuestCard}>
          <QuestCard currentQuest={currentQuest} isCompleted={isCompleted} completeQuest={completeQuest} changeQuest={changeQuest} />
        </BlurView>

      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
