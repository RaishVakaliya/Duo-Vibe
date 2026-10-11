import { FlagStatement } from "@/src/data/flagStatements";
import {
  FlagVote,
  FlagStat,
  FlagSession,
  FlagPartnerResultItem,
} from "@/src/types";

export type RedGreenFlagStep =
  | "mode_select"
  | "swiping"
  | "submitting"
  | "waiting"
  | "solo_result"
  | "partner_result";

export type RedGreenFlagMode = "solo" | "partner";

export interface SwipeDecision {
  index: number;
  statementId: string;
  vote: FlagVote;
}

export interface SoloSummary {
  redCount: number;
  greenCount: number;
  verdict: string;
  answers: SwipeDecision[];
}

export interface PartnerSummary {
  agreementsCount: number;
  disagreementsCount: number;
  totalCount: number;
  items: FlagPartnerResultItem[];
}

export interface UseRedGreenFlagReturn {
  // Navigation & session state
  step: RedGreenFlagStep;
  mode: RedGreenFlagMode;
  partnerName: string;
  hasPartner: boolean;
  activeSession: FlagSession | null;
  partnerSessionStatus: "none" | "waiting_for_partner" | "partner_finished" | "both_finished";

  // Deck state
  statements: FlagStatement[];
  currentIndex: number;
  currentStatement: FlagStatement | undefined;
  decisions: SwipeDecision[];
  canUndo: boolean;
  isAnimating: boolean;

  // Stats & toasts
  statsMap: Map<string, FlagStat>;
  currentStatToast: string | null;

  // Submission & error
  isSubmitting: boolean;
  submitError: string | null;

  // Results
  soloSummary: SoloSummary | null;
  partnerSummary: PartnerSummary | null;
  isSavedToMemories: boolean;
  isSavingMemory: boolean;

  // Actions
  handleSelectMode: (selectedMode: RedGreenFlagMode) => void;
  handleVote: (vote: FlagVote) => void;
  handleUndo: () => void;
  handleRetrySubmit: () => void;
  handlePlayAgain: () => void;
  handleBackToModeSelect: () => void;
  handleSaveToMemories: () => void;
  handleShareSoloResult: () => void;
  handleInvitePartner: () => void;
}

export interface ModeSelectProps {
  partnerName: string;
  hasPartner: boolean;
  partnerSessionStatus: "none" | "waiting_for_partner" | "partner_finished" | "both_finished";
  onSelectSolo: () => void;
  onSelectPartner: () => void;
  onInvitePartner: () => void;
  onBack: () => void;
}

export interface SwipeDeckProps {
  mode: RedGreenFlagMode;
  statements: FlagStatement[];
  currentIndex: number;
  canUndo: boolean;
  isAnimating: boolean;
  statToast: string | null;
  onVote: (vote: FlagVote) => void;
  onUndo: () => void;
  onBack: () => void;
}

export interface WaitingScreenProps {
  partnerName: string;
  onBack: () => void;
}

export interface SoloResultProps {
  summary: SoloSummary;
  onShare: () => void;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export interface PartnerResultProps {
  partnerName: string;
  summary: PartnerSummary;
  isSavedToMemories: boolean;
  isSavingMemory: boolean;
  onSaveToMemories: () => void;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}
