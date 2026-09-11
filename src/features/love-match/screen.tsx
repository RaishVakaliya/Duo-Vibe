import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  BackHandler,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "./styles";
import { ActiveDatePicker } from "./types";
import { ROUTES } from "@/src/constants/routes";
import { calculateLoveMatch } from "@/src/lib/loveMatch";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDateDisplay(isoString: string): string {
  if (!isoString) return "Select Date";
  try {
    const [year, month, day] = isoString.split("-");
    if (!year || !month || !day) return isoString;
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
    const dayFormatted = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("en-US", { month: "short" });
    const fullYear = date.getFullYear();
    return `${dayFormatted} ${monthShort} ${fullYear}`;
  } catch {
    return isoString;
  }
}

export default function LoveMatchScreen() {
  const router = useRouter();

  const [name1, setName1] = useState<string>("");
  const [dob1, setDob1] = useState<string>("2001-04-12");
  const [name2, setName2] = useState<string>("");
  const [dob2, setDob2] = useState<string>("2002-11-08");

  const [isFocused1, setIsFocused1] = useState<boolean>(false);
  const [isFocused2, setIsFocused2] = useState<boolean>(false);

  const [activePicker, setActivePicker] = useState<ActiveDatePicker>(null);

  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [selectedMonth, setSelectedMonth] = useState<number>(3); // 0-indexed (April)
  const [selectedYear, setSelectedYear] = useState<number>(2001);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace(ROUTES.HOME);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  const isFormValid =
    name1.trim().length > 0 &&
    dob1.length > 0 &&
    name2.trim().length > 0 &&
    dob2.length > 0;

  const handleOpenDatePicker = (target: "user" | "partner"): void => {
    const currentIso = target === "user" ? dob1 : dob2;
    if (currentIso) {
      const [y, m, d] = currentIso.split("-");
      if (y && m && d) {
        setSelectedYear(parseInt(y, 10));
        setSelectedMonth(parseInt(m, 10) - 1);
        setSelectedDay(parseInt(d, 10));
      }
    } else {
      setSelectedYear(2001);
      setSelectedMonth(0);
      setSelectedDay(1);
    }
    setActivePicker(target);
  };

  const handleConfirmDate = (): void => {
    const y = selectedYear;
    const m = String(selectedMonth + 1).padStart(2, "0");
    const d = String(selectedDay).padStart(2, "0");
    const isoFormatted = `${y}-${m}-${d}`;

    if (activePicker === "user") {
      setDob1(isoFormatted);
    } else if (activePicker === "partner") {
      setDob2(isoFormatted);
    }
    setActivePicker(null);
  };

  const handleCalculate = (): void => {
    if (!isFormValid) return;
    const matchResult = calculateLoveMatch(name1, dob1, name2, dob2);
    router.push({
      pathname: ROUTES.LOVE_MATCH_RESULT,
      params: {
        name1: name1.trim(),
        name2: name2.trim(),
        overall: String(matchResult.overall),
        communication: String(matchResult.communication),
        chemistry: String(matchResult.chemistry),
        trust: String(matchResult.trust),
        longTerm: String(matchResult.longTerm),
      },
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#FFF5F8", "#FFE8EF", "#FFDCE6"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#1E1B26" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Ionicons
              name="heart"
              size={24}
              color="#FF2D55"
              style={styles.headerHeartIcon}
            />
            <Text style={styles.headerTitle}>Love Match</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                style={styles.avatarCard}
              >
                <View style={styles.avatarIconCircle}>
                  <Ionicons name="person" size={22} color="#334155" />
                </View>
                <Text style={styles.avatarLabel}>Your Name</Text>
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={styles.nameInput}
                    placeholder={isFocused1 ? "" : "Rahul"}
                    placeholderTextColor="#CBD5E1"
                    value={name1}
                    onChangeText={setName1}
                    onFocus={() => setIsFocused1(true)}
                    onBlur={() => setIsFocused1(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={20}
                    cursorColor="#FF4D6D"
                    selectionColor="rgba(255, 77, 109, 0.35)"
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Enter your name"
                  />
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 100 }}
                style={styles.avatarCard}
              >
                <View style={styles.avatarIconCircle}>
                  <Ionicons name="person" size={22} color="#334155" />
                </View>
                <Text style={styles.avatarLabel}>Partner Name</Text>
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={styles.nameInput}
                    placeholder={isFocused2 ? "" : "Priya"}
                    placeholderTextColor="#CBD5E1"
                    value={name2}
                    onChangeText={setName2}
                    onFocus={() => setIsFocused2(true)}
                    onBlur={() => setIsFocused2(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={20}
                    cursorColor="#FF4D6D"
                    selectionColor="rgba(255, 77, 109, 0.35)"
                    underlineColorAndroid="transparent"
                    accessibilityLabel="Enter partner name"
                  />
                </View>
              </MotiView>
            </View>

            <View style={styles.datesRow}>
              <Pressable
                style={styles.dateCard}
                onPress={() => handleOpenDatePicker("user")}
                accessibilityRole="button"
                accessibilityLabel="Select your date of birth"
              >
                <View style={styles.dateIconBox}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                </View>
                <View style={styles.dateTextBox}>
                  <Text style={styles.dateLabel}>Your DOB</Text>
                  <Text style={styles.dateValue}>
                    {formatDateDisplay(dob1)}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.dateCard}
                onPress={() => handleOpenDatePicker("partner")}
                accessibilityRole="button"
                accessibilityLabel="Select partner date of birth"
              >
                <View style={styles.dateIconBox}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                </View>
                <View style={styles.dateTextBox}>
                  <Text style={styles.dateLabel}>Partner DOB</Text>
                  <Text style={styles.dateValue}>
                    {formatDateDisplay(dob2)}
                  </Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.calculateButton,
                !isFormValid && styles.calculateButtonDisabled,
              ]}
              onPress={handleCalculate}
              disabled={!isFormValid}
              accessibilityRole="button"
              accessibilityLabel="Calculate love compatibility"
            >
              <LinearGradient
                colors={
                  isFormValid
                    ? ["#FF4D6D", "#FF2D55", "#E11D48"]
                    : ["#CBD5E1", "#94A3B8"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.calculateGradient}
              >
                <Text style={styles.calculateText}>Calculate</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          visible={activePicker !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setActivePicker(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {activePicker === "user"
                    ? "Select Your Date of Birth"
                    : "Select Partner's Date of Birth"}
                </Text>
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setActivePicker(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </Pressable>
              </View>

              <View style={styles.modalColumnsRow}>
                <ScrollView
                  style={styles.pickerColumn}
                  showsVerticalScrollIndicator={false}
                >
                  {days.map((d) => {
                    const isSelected = d === selectedDay;
                    return (
                      <Pressable
                        key={d}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedDay(d)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.pickerItemTextSelected,
                          ]}
                        >
                          {String(d).padStart(2, "0")}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <ScrollView
                  style={styles.pickerColumn}
                  showsVerticalScrollIndicator={false}
                >
                  {MONTH_NAMES.map((mName, idx) => {
                    const isSelected = idx === selectedMonth;
                    return (
                      <Pressable
                        key={mName}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedMonth(idx)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.pickerItemTextSelected,
                          ]}
                        >
                          {mName}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <ScrollView
                  style={styles.pickerColumn}
                  showsVerticalScrollIndicator={false}
                >
                  {years.map((y) => {
                    const isSelected = y === selectedYear;
                    return (
                      <Pressable
                        key={y}
                        style={[
                          styles.pickerItem,
                          isSelected && styles.pickerItemSelected,
                        ]}
                        onPress={() => setSelectedYear(y)}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.pickerItemTextSelected,
                          ]}
                        >
                          {y}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              <Pressable
                style={styles.modalDoneButton}
                onPress={handleConfirmDate}
              >
                <LinearGradient
                  colors={["#FF4D6D", "#FF2D55"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalDoneGradient}
                >
                  <Text style={styles.modalDoneText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
