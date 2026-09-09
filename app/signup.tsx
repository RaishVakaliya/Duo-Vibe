import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#0D0B1A" }}>
      <StatusBar style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: "space-between",
        }}
      >
        <View style={{ paddingTop: 12 }}>
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Fredoka_700Bold",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Get Started
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#CBD5E1",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Create your couple space and start connecting.
          </Text>
        </View>

        <View style={{ paddingBottom: 24 }} />
      </SafeAreaView>
    </View>
  );
}
