import { styles } from './styles/mainScreen';
import { StatusBar } from 'expo-status-bar';
import { Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useEffect, useState } from 'react';

import getDifferentQuest from './utils/quest';
import { quests } from './data/quests';
import type { DailyQuest, DateString, Quest } from './types/quest';
import { isDateChanged, formatDate, finalizeDailyQuest, excludeClosedQuests } from './utils/dailyQuest';
import { getDailyQuestFromStorage, setDailyQuestInStorage } from './storage/dailyQuestStorage';
import QuestCard from './components/QuestCard';
import { getHistoryFromStorage, setHistoryInStorage } from './storage/historyStorage';

export default function App() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  })

  const [dailyQuest, setDailyQuest] = useState<DailyQuest>({
    quest: quests[0],
    date: formatDate(new Date()),
    status: 'active',
  })

  const [isStorageLoaded, setIsStorageLoaded] = useState(false)

  const [history, setHistory] = useState<DailyQuest[]>([])

  function changeQuest(): void {
    const availableQuests = excludeClosedQuests(quests, history)
    const newQuest = getDifferentQuest(availableQuests, dailyQuest.quest)
    setDailyQuest({ ...dailyQuest, quest: newQuest })
  }

  function completeQuest(): void {
    setDailyQuest({ ...dailyQuest, status: 'completed' })
  }

  useEffect(() => {
    async function loadData() {
      const storageHistory: DailyQuest[] = await getHistoryFromStorage()
      const storageData: DailyQuest | null = await getDailyQuestFromStorage()
      if (storageData) {
        const currentDate: DateString = formatDate(new Date())

        if (isDateChanged(storageData.date, currentDate)) {
          const finalizedDailyQuest: DailyQuest = finalizeDailyQuest(storageData)
          const updatedHistory: DailyQuest[] = [...storageHistory, finalizedDailyQuest]
          const availableQuests: Quest[] = excludeClosedQuests(quests, updatedHistory)
          const newQuest: Quest = getDifferentQuest(availableQuests, storageData.quest)

          setHistory(updatedHistory)
          setDailyQuest({
            quest: newQuest,
            date: currentDate,
            status: 'active',
          })

        } else {
          setDailyQuest(storageData)
          setHistory(storageHistory)
        }
      } else {
        setHistory(storageHistory)
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

  useEffect(() => {
    if (isStorageLoaded) {
      setHistoryInStorage(history)
    }
  }, [history, isStorageLoaded])

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
