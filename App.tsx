import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';

type Quest = {
  id: number;
  title: string;
  description: string;
}

export default function App() {

  const quest: Quest = {
    id: 1,
    title: 'Пройди сегодня новым маршрутом',
    description: 'Сверни с привычной дороги и исследуй что-то новое',
  }

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  })

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('./assets/background1.jpg')}
      style={styles.container}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={30} style={styles.appTitleCard}>
          <Text style={styles.appTitle}>WhyNot?</Text>
        </BlurView>

        <BlurView intensity={30} style={styles.questCard}>
          <Text style={styles.questLabel}>Опыт дня</Text>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questDescription}>{quest.description}</Text>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Выполнить</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Заменить</Text>
          </Pressable>

          <Pressable style={styles.ghostButton}>
            <Text style={styles.ghostButtonText}>Пропустить</Text>
          </Pressable>
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

  appTitleCard: {
    padding: 10,
    backgroundColor: 'rgba(225, 225, 225, .4)',
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'Manrope_600SemiBold',
  },

  questCard: {
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
  ghostButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostButtonText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
  },
});
