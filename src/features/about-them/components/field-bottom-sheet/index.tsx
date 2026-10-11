import React, { useState, useEffect } from "react";
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
import { GiftIdeaItem } from "@/src/types";
import { FieldBottomSheetProps } from "./types";
import { styles } from "./styles";

export const FieldBottomSheet: React.FC<FieldBottomSheetProps> = ({
  visible,
  field,
  currentValue,
  onClose,
  onSave,
  onClear,
}) => {
  // Local states
  const [selectedSingle, setSelectedSingle] = useState<string>("");
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [otherText, setOtherText] = useState<string>("");
  const [shortText, setShortText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [giftItems, setGiftItems] = useState<GiftIdeaItem[]>([]);
  const [newGiftText, setNewGiftText] = useState<string>("");

  useEffect(() => {
    if (!field || !visible) return;

    if (field.type === "choice") {
      const valStr = typeof currentValue === "string" ? currentValue : "";
      if (field.options && field.options.includes(valStr)) {
        setSelectedSingle(valStr);
        setOtherText("");
      } else if (valStr) {
        setSelectedSingle("__other__");
        setOtherText(valStr);
      } else {
        setSelectedSingle("");
        setOtherText("");
      }
    } else if (field.type === "multi") {
      const arr = Array.isArray(currentValue) ? (currentValue as string[]) : [];
      const standardChips = (field.options || []).filter((opt) =>
        arr.includes(opt),
      );
      const customChips = arr.filter(
        (item) => !(field.options || []).includes(item),
      );
      setSelectedMulti(standardChips);
      setOtherText(customChips.join(", "));
    } else if (field.type === "date") {
      if (typeof currentValue === "string" && currentValue) {
        const d = new Date(currentValue);
        setSelectedDate(isNaN(d.getTime()) ? new Date() : d);
      } else {
        setSelectedDate(new Date());
      }
      setShowDatePicker(false);
    } else if (field.type === "short_text") {
      setShortText(typeof currentValue === "string" ? currentValue : "");
    } else if (field.type === "list") {
      if (Array.isArray(currentValue)) {
        setGiftItems(currentValue as GiftIdeaItem[]);
      } else {
        setGiftItems([]);
      }
      setNewGiftText("");
    }
  }, [field, currentValue, visible]);

  if (!field) return null;

  const handleSave = () => {
    if (field.type === "choice") {
      const finalVal =
        selectedSingle === "__other__" ? otherText.trim() : selectedSingle;
      if (!finalVal) {
        onClear(field.key);
      } else {
        onSave(field.key, finalVal);
      }
    } else if (field.type === "multi") {
      const customEntries = otherText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const combined = Array.from(new Set([...selectedMulti, ...customEntries]));
      if (combined.length === 0) {
        onClear(field.key);
      } else {
        onSave(field.key, combined);
      }
    } else if (field.type === "date") {
      const iso = selectedDate.toISOString();
      onSave(field.key, iso);
    } else if (field.type === "short_text") {
      const trimmed = shortText.trim();
      if (!trimmed) {
        onClear(field.key);
      } else {
        onSave(field.key, trimmed);
      }
    } else if (field.type === "list") {
      if (giftItems.length === 0) {
        onClear(field.key);
      } else {
        onSave(field.key, giftItems);
      }
    }
    onClose();
  };

  const handleClear = () => {
    onClear(field.key);
    onClose();
  };

  const toggleMulti = (option: string) => {
    setSelectedMulti((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    newSelectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (newSelectedDate) {
      setSelectedDate(newSelectedDate);
    }
  };

  const handleAddGiftItem = () => {
    const trimmed = newGiftText.trim();
    if (!trimmed) return;
    const newItem: GiftIdeaItem = {
      id: Date.now().toString(),
      text: trimmed,
      done: false,
    };
    setGiftItems((prev) => [...prev, newItem]);
    setNewGiftText("");
  };

  const toggleGiftDone = (id: string) => {
    setGiftItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const removeGiftItem = (id: string) => {
    setGiftItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.sheetTitle}>{field.label}</Text>
              <Text style={styles.sheetSubtitle}>{field.group}</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/* Content Body */}
          <ScrollView
            style={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Single Choice Field */}
            {field.type === "choice" && (
              <View>
                <View style={styles.chipsWrap}>
                  {(field.options || []).map((option) => {
                    const isSelected = selectedSingle === option;
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.chip,
                          isSelected && styles.chipSelected,
                        ]}
                        onPress={() => setSelectedSingle(option)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {field.allowOther && (
                    <Pressable
                      style={[
                        styles.chip,
                        selectedSingle === "__other__" && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedSingle("__other__")}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedSingle === "__other__" &&
                            styles.chipTextSelected,
                        ]}
                      >
                        Other...
                      </Text>
                    </Pressable>
                  )}
                </View>

                {field.allowOther && selectedSingle === "__other__" && (
                  <View style={styles.otherContainer}>
                    <View style={styles.otherLabelRow}>
                      <Text style={styles.otherLabel}>Custom answer</Text>
                      <Text style={styles.otherCount}>
                        {otherText.length}/30
                      </Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={otherText}
                      onChangeText={(t) => setOtherText(t.slice(0, 30))}
                      placeholder="Type custom answer..."
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      maxLength={30}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Multi Choice Field */}
            {field.type === "multi" && (
              <View>
                <View style={styles.chipsWrap}>
                  {(field.options || []).map((option) => {
                    const isSelected = selectedMulti.includes(option);
                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.chip,
                          isSelected && styles.chipSelected,
                        ]}
                        onPress={() => toggleMulti(option)}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={COLORS.white}
                          />
                        )}
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {field.allowOther && (
                  <View style={styles.otherContainer}>
                    <View style={styles.otherLabelRow}>
                      <Text style={styles.otherLabel}>
                        Other options (comma separated)
                      </Text>
                      <Text style={styles.otherCount}>
                        {otherText.length}/40
                      </Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={otherText}
                      onChangeText={(t) => setOtherText(t.slice(0, 40))}
                      placeholder="e.g. Seafood, Shellfish"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      maxLength={40}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Date Picker Field */}
            {field.type === "date" && (
              <View style={styles.dateContainer}>
                <Pressable
                  style={styles.dateDisplayRow}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.dateDisplayText}>
                      {selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="rgba(255, 255, 255, 0.4)"
                  />
                </Pressable>

                {(showDatePicker || Platform.OS === "ios") && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    textColor={COLORS.white}
                  />
                )}
              </View>
            )}

            {/* Short Text Field */}
            {field.type === "short_text" && (
              <View style={styles.otherContainer}>
                <View style={styles.otherLabelRow}>
                  <Text style={styles.otherLabel}>Note</Text>
                  <Text style={styles.otherCount}>
                    {shortText.length}/{field.maxChars || 60}
                  </Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={shortText}
                  onChangeText={(t) =>
                    setShortText(t.slice(0, field.maxChars || 60))
                  }
                  placeholder={field.placeholder || "Enter details..."}
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  maxLength={field.maxChars || 60}
                />
              </View>
            )}

            {/* List Field (Gift Ideas) */}
            {field.type === "list" && (
              <View>
                <View style={styles.listAddRow}>
                  <TextInput
                    style={styles.listAddInput}
                    value={newGiftText}
                    onChangeText={setNewGiftText}
                    placeholder={field.placeholder || "Add a gift idea..."}
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    maxLength={50}
                  />
                  <Pressable
                    style={styles.listAddButton}
                    onPress={handleAddGiftItem}
                  >
                    <Text style={styles.listAddButtonText}>Add</Text>
                  </Pressable>
                </View>

                {giftItems.map((item) => (
                  <View key={item.id} style={styles.listItemRow}>
                    <Pressable
                      style={styles.listItemLeft}
                      onPress={() => toggleGiftDone(item.id)}
                    >
                      <Ionicons
                        name={item.done ? "checkbox" : "square-outline"}
                        size={20}
                        color={item.done ? COLORS.success : "rgba(255, 255, 255, 0.5)"}
                      />
                      <Text
                        style={[
                          styles.listItemText,
                          item.done && styles.listItemTextDone,
                        ]}
                      >
                        {item.text}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removeGiftItem(item.id)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="rgba(255, 255, 255, 0.4)"
                      />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {currentValue !== undefined && currentValue !== null && (
              <Pressable style={styles.clearButton} onPress={handleClear}>
                <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            )}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color={COLORS.white}
              />
              <Text style={styles.saveButtonText}>Save Details</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
