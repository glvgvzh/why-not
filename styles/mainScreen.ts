import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
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
    marginBottom: 24,
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
    marginBottom: 24,
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
  },
  secondaryButtonText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
  },
  historyButtonBlur: {
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  }
});
