import React from "react";

export type ProfileScreenProps = Record<string, never>;

export interface PartnerProfileData {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export interface ProfileMenuItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  accessibilityLabel: string;
  hasBorder?: boolean;
  isDestructive?: boolean;
  disabled?: boolean;
  rightComponent?: React.ReactNode;
}
