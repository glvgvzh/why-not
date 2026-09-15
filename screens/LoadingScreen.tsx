import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { ImageBackground, ActivityIndicator } from "react-native"
import { styles } from "../styles/app"

function LoadingScreen() {
    return (
        <SafeAreaProvider>
            <ImageBackground
                source={require('../assets/background1.jpg')}
                style={styles.container}
                resizeMode='cover'>
                <SafeAreaView style={styles.loadingSafeArea}>
                    <ActivityIndicator size="large" color="black" testID="loader" />
                </SafeAreaView>
            </ImageBackground>
        </SafeAreaProvider>
    )
}

export default LoadingScreen
