import { styles } from './styles/app';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useEffect, useState } from 'react';

import { getDifferentQuest } from './utils/quest';
import { quests } from './data/quests';
import type { DailyQuest, DateString, HistoryItem } from './types/quest';
import { formatDate, excludeClosedQuests, handleDayChange } from './utils/dailyQuest';
import { getDailyQuestFromStorage, setDailyQuestInStorage } from './storage/dailyQuestStorage';
import { getHistoryFromStorage, setHistoryInStorage } from './storage/historyStorage';
import MainScreen from './screens/MainScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoadingScreen from './screens/LoadingScreen';

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
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentScreen, setCurrentScreen] = useState<'main' | 'history'>('main')

  function changeQuest(): void {
    const availableQuests = excludeClosedQuests(quests, history)
    const newQuest = getDifferentQuest(availableQuests, dailyQuest.quest)
    if (newQuest === null) return
    setDailyQuest({ ...dailyQuest, quest: newQuest })
  }

  function completeQuest(): void {
    const completedDailyQuest: DailyQuest = { ...dailyQuest, status: 'completed' }
    const updatedHistory: HistoryItem[] = [...history, completedDailyQuest]
    setDailyQuest(completedDailyQuest)
    setHistory(updatedHistory)
  }

  useEffect(() => {
    async function loadData() {
      const storageHistory: HistoryItem[] = await getHistoryFromStorage()
      const storageDailyQuest: DailyQuest | null = await getDailyQuestFromStorage()
      if (storageDailyQuest) {
        const currentDate: DateString = formatDate(new Date())
        const { dailyQuest, history } = handleDayChange(storageDailyQuest, storageHistory, currentDate)

        setHistory(history)
        setDailyQuest(dailyQuest)
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

  if (!fontsLoaded || !isStorageLoaded) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('./assets/background1.jpg')}
        style={styles.container}
        resizeMode='cover'
      >
        <SafeAreaView style={styles.safeArea}>
          {currentScreen === 'main' &&
            <MainScreen
              dailyQuest={dailyQuest}
              completeQuest={completeQuest}
              changeQuest={changeQuest}
              onOpenHistory={() => setCurrentScreen('history')}
            />
          }
          {currentScreen === 'history' &&
            <HistoryScreen
              history={history}
              onBack={() => setCurrentScreen('main')}
            />
          }
        </SafeAreaView>
        <StatusBar style="auto" />
      </ImageBackground>
    </SafeAreaProvider>
  );
}
