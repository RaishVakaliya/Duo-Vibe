import { useState, useCallback } from "react";
import { BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ROUTES } from "@/src/constants/routes";
import { calculateLoveMatch } from "@/src/lib/loveMatch";
import { ActiveDatePicker } from "./types";

export function useLoveMatchForm() {
  const router = useRouter();

  const [name1, setName1] = useState<string>("");
  const [dob1, setDob1] = useState<string>("2001-04-12");
  const [name2, setName2] = useState<string>("");
  const [dob2, setDob2] = useState<string>("2002-11-08");

  const [isFocused1, setIsFocused1] = useState<boolean>(false);
  const [isFocused2, setIsFocused2] = useState<boolean>(false);

  const [activePicker, setActivePicker] = useState<ActiveDatePicker>(null);

  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
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

  const handleBack = (): void => {
    router.replace(ROUTES.HOME);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return {
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
  };
}
