import { styles } from './styles/mainScreen';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useState } from 'react';

type Quest = {
  id: number;
  title: string;
  description: string;
}

export default function App() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  })

  const quests: Quest[] = [
    {
      id: 1,
      title: 'Пройди сегодня новым маршрутом',
      description: 'Сверни с привычной дороги и исследуй что-то новое',
    },
    {
      id: 2,
      title: 'Зайди сегодня в новое место',
      description: 'Выбери кафе, магазин, двор или улицу, где ты раньше не был',
    },
    {
      id: 3,
      title: 'Сфотографируй одну случайную деталь дня',
      description: 'Заметь что-то необычное вокруг и сохрани это как маленькое воспоминание',
    },
  ]

  const [currentQuest, setCurrentQuest] = useState(quests[0])
  const [isCompleted, setIsCompleted] = useState(false)

  function changeQuest() {
    let newIndex = Math.floor(Math.random() * quests.length)

    while (quests[newIndex].id === currentQuest.id) {
      newIndex = Math.floor(Math.random() * quests.length)
    }
    setCurrentQuest(quests[newIndex])
  }

  function completeQuest() {
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

        </BlurView>

      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
