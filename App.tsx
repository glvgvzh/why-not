import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, ImageBackground } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  appTitle: {
    fontSize: 28,
    fontFamily: 'Manrope_600SemiBold',
    marginBottom: 16,
  },

  activeQuestCard: {
    width: '90%',
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(225, 225, 225, .4)',
    overflow: 'hidden',
  },
  questLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Manrope_500Medium',
  },
  questTitle: {
    fontSize: 24,
    marginBottom: 12,
    fontFamily: 'Manrope_600SemiBold',
  },
  questDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'Manrope_400Regular',
  },

  completedQuestCard: {
    width: '90%',
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(236, 255, 227, 0.4)',
    overflow: 'hidden',
  },

  completedText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    color: 'rgb(52, 116, 36)',
  },

  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(225, 225, 225, .5)',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(225, 225, 225, .3)',
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
  },
});
