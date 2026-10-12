import React from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { GradientButton } from "@/src/components/ui/gradient-button";
import { useLoveMatchForm } from "./use-love-match-form";
import { PartnerAvatarInput } from "./components/partner-avatar-input";
import { DobInput } from "./components/dob-input";
import { DatePickerModal } from "./components/date-picker-modal";

export default function LoveMatchScreen() {
  const {
    name1,
    setName1,
    dob1,
    name2,
    setName2,
    dob2,
    isFocused1,
    setIsFocused1,
    isFocused2,
    setIsFocused2,
    activePicker,
    setActivePicker,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    years,
    days,
    isFormValid,
    handleOpenDatePicker,
    handleConfirmDate,
    handleCalculate,
    handleBack,
  } = useLoveMatchForm();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFE8EF", "#FFDCE6"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
          title="Love Match"
          align="center"
          theme="light"
          titleIcon={
            <Ionicons
              name="heart"
              size={24}
              color="#FF2D55"
              style={styles.headerHeartIcon}
            />
          }
          onBack={handleBack}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <MotiView
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 350 }}
              style={styles.subtitleContainer}
            >
              <Text style={styles.subtitle}>
                Enter your details and discover your love compatibility.
              </Text>
            </MotiView>

            <View style={styles.avatarsRow}>
              <PartnerAvatarInput
                label="Your Name"
                name={name1}
                onChangeName={setName1}
                isFocused={isFocused1}
                onFocus={() => setIsFocused1(true)}
                onBlur={() => setIsFocused1(false)}
                placeholder="Rahul"
                accessibilityLabel="Enter your name"
                delay={0}
              />

              <PartnerAvatarInput
                label="Partner Name"
                name={name2}
                onChangeName={setName2}
                isFocused={isFocused2}
                onFocus={() => setIsFocused2(true)}
                onBlur={() => setIsFocused2(false)}
                placeholder="Priya"
                accessibilityLabel="Enter partner name"
                delay={100}
              />
            </View>

            <View style={styles.datesRow}>
              <DobInput
                label="Your DOB"
                dob={dob1}
                onPress={() => handleOpenDatePicker("user")}
                accessibilityLabel="Select your date of birth"
              />

              <DobInput
                label="Partner DOB"
                dob={dob2}
                onPress={() => handleOpenDatePicker("partner")}
                accessibilityLabel="Select partner date of birth"
              />
            </View>

            <GradientButton
              label="Calculate"
              onPress={handleCalculate}
              disabled={!isFormValid}
              accessibilityLabel="Calculate love compatibility"
              style={{ marginTop: 20 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <DatePickerModal
          visible={activePicker !== null}
          activePicker={activePicker}
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          days={days}
          years={years}
          onSelectDay={setSelectedDay}
          onSelectMonth={setSelectedMonth}
          onSelectYear={setSelectedYear}
          onConfirm={handleConfirmDate}
          onClose={() => setActivePicker(null)}
        />
      </SafeAreaView>
    </View>
  );
}
