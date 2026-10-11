import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { COLORS } from "@/src/constants/colors";
import { PlanKind } from "@/src/types";
import { AddPlanBottomSheetProps } from "./types";
import { styles } from "./styles";

const QUICK_STARTS: { title: string; kind: PlanKind; icon: string }[] = [
  { title: "Movie night", kind: "date", icon: "film-outline" },
  { title: "Dinner out", kind: "date", icon: "restaurant-outline" },
  { title: "Video call", kind: "call", icon: "videocam-outline" },
  { title: "Weekend getaway", kind: "trip", icon: "airplane-outline" },
  { title: "Coffee & walk", kind: "date", icon: "cafe-outline" },
];

const PLAN_KINDS: PlanKind[] = [
  "date",
  "trip",
  "call",
  "birthday",
  "anniversary",
  "other",
];

export const AddPlanBottomSheet: React.FC<AddPlanBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState<string>("");
  const [kind, setKind] = useState<PlanKind>("date");
  const [date, setDate] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [note, setNote] = useState<string>("");
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const resetForm = () => {
    setTitle("");
    setKind("date");
    setDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    setNote("");
    setPickerMode(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleQuickStart = (item: (typeof QUICK_STARTS)[0]) => {
    setTitle(item.title);
    setKind(item.kind);
  };

  const handlePickerChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setPickerMode(null);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit({
      title: trimmedTitle.slice(0, 60),
      kind,
      date,
      allDay: false,
      note: note.trim().slice(0, 200),
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdropTouchable} onPress={handleClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Plan Something Together</Text>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Quick Start Chips */}
            <Text style={styles.sectionLabel}>Quick starts</Text>
            <View style={styles.quickStartRow}>
              {QUICK_STARTS.map((qs) => (
                <Pressable
                  key={qs.title}
                  style={styles.quickStartChip}
                  onPress={() => handleQuickStart(qs)}
                >
                  <Ionicons
                    name={qs.icon as any}
                    size={14}
                    color={COLORS.primaryLight}
                  />
                  <Text style={styles.quickStartText}>{qs.title}</Text>
                </Pressable>
              ))}
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>Plan title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={(t) => setTitle(t.slice(0, 60))}
                placeholder="e.g. Candlelight Dinner at Bistro"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                maxLength={60}
              />
            </View>

            {/* Kind Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>Type of plan</Text>
              <View style={styles.kindChipsRow}>
                {PLAN_KINDS.map((k) => {
                  const isSelected = kind === k;
                  return (
                    <Pressable
                      key={k}
                      style={[
                        styles.kindChip,
                        isSelected && styles.kindChipSelected,
                      ]}
                      onPress={() => setKind(k)}
                    >
                      <Text
                        style={[
                          styles.kindChipText,
                          isSelected && styles.kindChipTextSelected,
                        ]}
                      >
                        {k}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Date and Time Picker Controls */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>Date & Time</Text>
              <View style={styles.dateTimeRow}>
                <Pressable
                  style={styles.datePickerButton}
                  onPress={() => setPickerMode("date")}
                >
                  <Text style={styles.dateTimeText}>
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                </Pressable>

                <Pressable
                  style={styles.datePickerButton}
                  onPress={() => setPickerMode("time")}
                >
                  <Text style={styles.dateTimeText}>
                    {date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                </Pressable>
              </View>

              {pickerMode !== null && (
                <DateTimePicker
                  value={date}
                  mode={pickerMode}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handlePickerChange}
                  textColor={COLORS.white}
                />
              )}
            </View>

            {/* Note Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionLabel}>Optional note</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={note}
                onChangeText={(t) => setNote(t.slice(0, 200))}
                placeholder="Details, reservation info, or sweet reminder..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                maxLength={200}
                multiline
              />
            </View>

            {/* Submit Button */}
            <Pressable
              style={[
                styles.submitButton,
                !title.trim() && { opacity: 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={!title.trim()}
            >
              <Ionicons
                name="calendar-sharp"
                size={18}
                color={COLORS.white}
              />
              <Text style={styles.submitButtonText}>Create Plan</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
