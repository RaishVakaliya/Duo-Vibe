export interface LoveMatchFormState {
  name1: string;
  dob1: string;
  name2: string;
  dob2: string;
}

export type ActiveDatePicker = "user" | "partner" | null;

export interface PartnerAvatarInputProps {
  label: string;
  name: string;
  onChangeName: (text: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  accessibilityLabel: string;
  delay?: number;
}

export interface DobInputProps {
  label: string;
  dob: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface DatePickerModalProps {
  visible: boolean;
  activePicker: ActiveDatePicker;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  days: number[];
  years: number[];
  onSelectDay: (day: number) => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}
