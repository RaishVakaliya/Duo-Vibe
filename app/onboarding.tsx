import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#0D0B1A] px-6">
      <StatusBar style="light" />
      <Text className="text-2xl font-bold text-white text-center">
        Onboarding Screen
      </Text>
      <Text className="text-sm text-[#FF6B81] mt-2 text-center">
        Coming soon
      </Text>
    </View>
  );
}
