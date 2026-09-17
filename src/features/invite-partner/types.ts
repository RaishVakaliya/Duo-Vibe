export interface InvitePartnerParams {
  source?: string;
  [key: string]: string | string[] | undefined;
}

export interface InviteCodeDisplayProps {
  inviteCode: string;
  timeLeft: number;
  isFinished: boolean;
  isRefreshing: boolean;
  onRefreshCode: () => Promise<void>;
  onShareInvite: () => Promise<void>;
  formatMinutesSeconds: (seconds: number) => string;
}

export interface PartnerCodeInputProps {
  partnerCode: string;
  onChangePartnerCode: (text: string) => void;
  onPasteCode: () => Promise<void>;
  onConnect: () => Promise<void>;
  isConnecting: boolean;
}
