import { styles } from './styles/mainScreen';
import { StatusBar } from 'expo-status-bar';
import { Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useEffect, useState } from 'react';

import getDifferentQuest from './utils/quest';
import { quests } from './data/quests';
import type { DailyQuest } from './types/quest';
import { getDailyQuestFromStorage, setDailyQuestInStorage } from './storage/dailyQuestStorage';
import QuestCard from './components/QuestCard';

export default function App() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  })

  const [dailyQuest, setDailyQuest] = useState<DailyQuest>({
    quest: quests[0],
    date: Date.now(),
    status: 'active',
  })

  const [isStorageLoaded, setIsStorageLoaded] = useState(false)

  function changeQuest(): void {
    const newQuest = getDifferentQuest(quests, dailyQuest.quest)
    setDailyQuest({ ...dailyQuest, quest: newQuest })
  }

  function completeQuest(): void {
    setDailyQuest({ ...dailyQuest, status: 'completed' })
  }

  useEffect(() => {
    async function loadData() {
      const storageData = await getDailyQuestFromStorage()
      if (storageData) {
        setDailyQuest(storageData)
      }
      setIsStorageLoaded(true)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (isStorageLoaded) {
      setDailyQuestInStorage(dailyQuest)
    }
  }, [dailyQuest, isStorageLoaded])

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('./assets/background1.jpg')}
      style={styles.container}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.appTitle}>WhyNot?</Text>

        <BlurView intensity={30} style={dailyQuest.status === 'active' ? styles.activeQuestCard : styles.completedQuestCard}>
          <QuestCard currentQuest={dailyQuest.quest} status={dailyQuest.status} completeQuest={completeQuest} changeQuest={changeQuest} />
        </BlurView>

      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
