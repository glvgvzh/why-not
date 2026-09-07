import { styles } from './styles/app';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useEffect, useState } from 'react';

import getDifferentQuest from './utils/quest';
import { quests } from './data/quests';
import type { DailyQuest, DateString, Quest } from './types/quest';
import { isDateChanged, formatDate, finalizeDailyQuest, excludeClosedQuests } from './utils/dailyQuest';
import { getDailyQuestFromStorage, setDailyQuestInStorage } from './storage/dailyQuestStorage';
import { getHistoryFromStorage, setHistoryInStorage } from './storage/historyStorage';
import MainScreen from './screens/MainScreen';
import HistoryScreen from './screens/HistoryScreen';


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
  const [currentScreen, setCurrentScreen] = useState<'main' | 'history'>('main')

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
