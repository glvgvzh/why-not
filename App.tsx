import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>WhyNot</Text>
      <View>
        <Text>Квест дня</Text>
        <Text>Пройди сегодня новым маршрутом</Text>
        <Text>Сверни с привычной дороги и исследуй что-то новое</Text>
        <Pressable>
          <Text>Выполнить</Text>
        </Pressable>
        <Pressable>
          <Text>Заменить</Text>
        </Pressable>
        <Pressable>
          <Text>Пропустить</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
