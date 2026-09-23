import { styles } from './styles/app'
import { StatusBar } from 'expo-status-bar'
import { ImageBackground, AppState } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from '@expo-google-fonts/manrope'
import { useEffect, useRef, useState } from 'react'

import { getDifferentQuest } from './utils/quest'
import { quests } from './data/quests'
import type { DailyQuest, DateString, HistoryItem, Quest } from './types/quest'
import { formatDate, excludeClosedQuests, handleDayChange } from './utils/dailyQuest'
import { getDailyQuestFromStorage, setDailyQuestInStorage } from './storage/dailyQuestStorage'
import { getHistoryFromStorage, setHistoryInStorage } from './storage/historyStorage'
import MainScreen from './screens/MainScreen'
import HistoryScreen from './screens/HistoryScreen'
import LoadingScreen from './screens/LoadingScreen'

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

  const availableQuests: Quest[] = excludeClosedQuests(quests, history)
  const canReplaceQuest: boolean = availableQuests.some((quest) => quest.id !== dailyQuest.quest.id)

  function changeQuest(): void {
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
        const { dailyQuest, history } = handleDayChange(
          storageDailyQuest,
          storageHistory,
          currentDate,
        )
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

  const dailyQuestRef = useRef(dailyQuest)

  useEffect(() => {
    dailyQuestRef.current = dailyQuest
  }, [dailyQuest])

  const historyRef = useRef(history)

  useEffect(() => {
    historyRef.current = history
  }, [history])

  useEffect(() => {
    if (!isStorageLoaded) return
    const subscription = AppState.addEventListener('change', (newAppState) => {
      if (newAppState === 'active') {
        const currentDate: DateString = formatDate(new Date())
        const { dailyQuest: actualDailyQuest, history: actualHistory } = handleDayChange(
          dailyQuestRef.current,
          historyRef.current,
          currentDate,
        )
        dailyQuestRef.current = actualDailyQuest
        historyRef.current = actualHistory
        setDailyQuest(actualDailyQuest)
        setHistory(actualHistory)
      }
    })
    return () => subscription.remove()
  }, [isStorageLoaded])

  if (!fontsLoaded || !isStorageLoaded) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('./assets/background1.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {currentScreen === 'main' && (
            <MainScreen
              dailyQuest={dailyQuest}
              completeQuest={completeQuest}
              changeQuest={changeQuest}
              onOpenHistory={() => setCurrentScreen('history')}
              canReplaceQuest={canReplaceQuest}
            />
          )}
          {currentScreen === 'history' && (
            <HistoryScreen history={history} onBack={() => setCurrentScreen('main')} />
          )}
        </SafeAreaView>
        <StatusBar style="auto" />
      </ImageBackground>
    </SafeAreaProvider>
  )
}
