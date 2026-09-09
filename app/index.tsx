import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-6">
      <Text className="text-2xl font-bold text-white mb-6">
        Duo Setup Complete
      </Text>
      <Button
        size="lg"
        className="bg-indigo-600 active:bg-indigo-700"
        onPress={() => {}}
      >
        <ButtonText className="text-white font-semibold">
          Gluestack Button
        </ButtonText>
      </Button>
    </View>
  );
}
