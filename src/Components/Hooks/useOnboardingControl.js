import { useOnboarding } from '../contexts/OnboardingContext';

export const useOnboardingControl = () => {
  const { startOnboarding, onboardingState } = useOnboarding();

  const restartOnboarding = () => {
    localStorage.removeItem('inawo_hasSeenOnboarding');
    startOnboarding();
  };

  const canShowHelp = () => {
    return !onboardingState.hasCompletedOnboarding;
  };

  return {
    restartOnboarding,
    canShowHelp,
    hasCompletedOnboarding: onboardingState.hasCompletedOnboarding
  };
};