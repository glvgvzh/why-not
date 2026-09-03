import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontFamily: 'Manrope_600SemiBold',
        alignSelf: 'center',
    },
    mainPart: {
        flex: 1,
        marginVertical: 16,
    },
    historyCardCompleted: {
        width: '90%',
        borderRadius: 16,
        overflow: 'hidden',
        padding: 16,
        marginVertical: 4,
        backgroundColor: 'rgba(236, 255, 227, 0.4)',
        alignSelf: 'center'
    },
    historyCardMissed: {
        width: '90%',
        borderRadius: 16,
        overflow: 'hidden',
        padding: 16,
        marginVertical: 4,
        backgroundColor: 'rgba(225, 225, 225, .4)',
        alignSelf: 'center'
    },
    emptyHistory: {
        fontSize: 16,
        fontFamily: 'Manrope_400Regular',
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(225, 225, 225, .3)',
        borderRadius: 16,
        alignItems: 'center',
        alignSelf: 'center'
    },
    backButtonText: {
        fontSize: 16,
        fontFamily: 'Manrope_400Regular',
    },
    questDate: {
        marginBottom: 4,
        fontSize: 12,
        fontFamily: 'Manrope_400Regular',
    },
    questTitle: {
        fontSize: 16,
        fontFamily: 'Manrope_500Medium',
        marginBottom: 4,
    },
    questDescription: {
        fontSize: 12,
        fontFamily: 'Manrope_400Regular',
        marginBottom: 4,
    },
    completedText: {
        fontFamily: 'Manrope_600SemiBold',
        fontSize: 16,
        color: 'rgb(52, 116, 36)',
    },
    missedText: {
        fontFamily: 'Manrope_400Regular',
        fontSize: 12,
    },
})
