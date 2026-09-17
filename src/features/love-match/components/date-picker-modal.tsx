import React from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles";
import { GRADIENTS } from "@/src/constants/colors";
import { MONTH_NAMES } from "@/src/lib/loveMatch";
import { DatePickerModalProps } from "../types";

export function DatePickerModal({
  visible,
  activePicker,
  selectedDay,
  selectedMonth,
  selectedYear,
  days,
  years,
  onSelectDay,
  onSelectMonth,
  onSelectYear,
  onConfirm,
  onClose,
}: DatePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
              onPress={onClose}
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
                    onPress={() => onSelectDay(d)}
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
                    onPress={() => onSelectMonth(idx)}
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
                    onPress={() => onSelectYear(y)}
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
            onPress={onConfirm}
          >
            <LinearGradient
              colors={[...GRADIENTS.primaryAction]}
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
  );
}
