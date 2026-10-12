import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/src/constants/colors";
import {
  PARTNER_NOTE_GROUPS,
  PARTNER_NOTE_FIELDS,
  PartnerNoteFieldDef,
} from "@/src/data/partnerNoteFields";
import { GiftIdeaItem } from "@/src/types";
import { ScreenHeader } from "@/src/components/ui/screen-header";
import { ScreenState } from "@/src/components/ui/screen-state";
import { ProgressRing } from "./components/progress-ring";
import { FieldBottomSheet } from "./components/field-bottom-sheet";
import { useAboutThem } from "./use-about-them";
import { styles } from "./styles";

export default function AboutThemScreen() {
  const router = useRouter();
  const {
    notes,
    loading,
    savingKey,
    savedKey,
    failedSave,
    filledCount,
    totalCount,
    handleSave,
    handleClear,
    retryFailedSave,
  } = useAboutThem();

  const [activeField, setActiveField] = useState<PartnerNoteFieldDef | null>(
    null,
  );

  const formatPreview = (field: PartnerNoteFieldDef, val: unknown): string => {
    if (val === undefined || val === null) return "";
    if (field.type === "date" && typeof val === "string") {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (field.type === "multi" && Array.isArray(val)) {
      return (val as string[]).join(", ");
    }
    if (field.type === "list" && Array.isArray(val)) {
      const items = val as GiftIdeaItem[];
      const completed = items.filter((i) => i.done).length;
      return `${items.length} idea${items.length === 1 ? "" : "s"} (${completed} checked)`;
    }
    return String(val);
  };

  const isFieldFilled = (field: PartnerNoteFieldDef): boolean => {
    const val = notes[field.key];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <ScreenHeader
          title="About Them"
          subtitle="Only you can see this"
          backIcon="arrow-back"
          onBack={() => router.back()}
          rightElement={<ProgressRing filled={filledCount} total={totalCount} />}
        />

        {/* Retry Banner if offline/error */}
        {failedSave && (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.retryBanner}>
              <View style={styles.retryLeft}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={18}
                  color={COLORS.error}
                />
                <Text style={styles.retryText}>
                  Failed to save change offline
                </Text>
              </View>
              <Pressable
                style={styles.retryButton}
                onPress={retryFailedSave}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        )}

        {loading ? (
          <ScreenState variant="loading" />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {PARTNER_NOTE_GROUPS.map((group) => {
              const groupFields = PARTNER_NOTE_FIELDS.filter(
                (f) => f.group === group,
              );

              return (
                <View key={group} style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <Ionicons
                      name={
                        group === "Important dates"
                          ? "calendar"
                          : group === "Favourites"
                            ? "heart"
                            : group === "Gifts and sizes"
                              ? "gift"
                              : "sparkles"
                      }
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.sectionTitle}>{group}</Text>
                  </View>

                  <View style={styles.sectionCard}>
                    {groupFields.map((field, idx) => {
                      const filled = isFieldFilled(field);
                      const isSaving = savingKey === field.key;
                      const isSaved = savedKey === field.key;
                      const isLast = idx === groupFields.length - 1;

                      if (!filled) {
                        return (
                          <Pressable
                            key={field.key}
                            style={styles.emptyFieldRow}
                            onPress={() => setActiveField(field)}
                          >
                            <View style={styles.emptyFieldLeft}>
                              <Ionicons
                                name="add-circle-outline"
                                size={18}
                                color="rgba(255, 255, 255, 0.4)"
                              />
                              <Text style={styles.emptyFieldLabel}>
                                {field.label}
                              </Text>
                            </View>
                            <View style={styles.addChip}>
                              <Text style={styles.addChipText}>+ Add</Text>
                            </View>
                          </Pressable>
                        );
                      }

                      return (
                        <Pressable
                          key={field.key}
                          style={[
                            styles.fieldRow,
                            isLast && styles.fieldRowLast,
                          ]}
                          onPress={() => setActiveField(field)}
                        >
                          <View style={styles.fieldLeft}>
                            <Text style={styles.fieldLabel}>{field.label}</Text>
                            <Text
                              style={styles.fieldValuePreview}
                              numberOfLines={1}
                            >
                              {formatPreview(field, notes[field.key])}
                            </Text>
                          </View>

                          <View style={styles.fieldRight}>
                            {isSaving && (
                              <ActivityIndicator
                                size="small"
                                color={COLORS.primary}
                              />
                            )}
                            {isSaved && !isSaving && (
                              <View style={styles.savedBadge}>
                                <Ionicons
                                  name="checkmark"
                                  size={11}
                                  color={COLORS.success}
                                />
                                <Text style={styles.savedBadgeText}>Saved</Text>
                              </View>
                            )}
                            <Ionicons
                              name="pencil-outline"
                              size={16}
                              color="rgba(255, 255, 255, 0.4)"
                            />
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Bottom Sheet Modal */}
        <FieldBottomSheet
          visible={activeField !== null}
          field={activeField}
          currentValue={activeField ? notes[activeField.key] : null}
          onClose={() => setActiveField(null)}
          onSave={handleSave}
          onClear={handleClear}
        />
      </SafeAreaView>
    </View>
  );
}
