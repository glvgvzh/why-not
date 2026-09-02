import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Manrope_600SemiBold',
        alignSelf: 'center',
    },
    mainPart: {
        flex: 1,
    },
    emptyHistory: {
        fontSize: 16,
        fontFamily: 'Manrope_400Regular',
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(225, 225, 225, .3)',
        borderRadius: 16,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        fontFamily: 'Manrope_400Regular',
    }
})
