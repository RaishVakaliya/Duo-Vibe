import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { styles } from "../styles";
import { PartnerAvatarInputProps } from "../types";

export function PartnerAvatarInput({
  label,
  name,
  onChangeName,
  isFocused,
  onFocus,
  onBlur,
  placeholder = "Name",
  accessibilityLabel,
  delay = 0,
}: PartnerAvatarInputProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, delay }}
      style={styles.avatarCard}
    >
      <View style={styles.avatarIconCircle}>
        <Ionicons name="person" size={22} color="#334155" />
      </View>
      <Text style={styles.avatarLabel}>{label}</Text>
      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder={isFocused ? "" : placeholder}
          placeholderTextColor="#CBD5E1"
          value={name}
          onChangeText={onChangeName}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={20}
          cursorColor="#FF4D6D"
          selectionColor="rgba(255, 77, 109, 0.35)"
          underlineColorAndroid="transparent"
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    </MotiView>
  );
}
