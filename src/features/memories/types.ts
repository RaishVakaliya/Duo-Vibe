import { Memory } from "@/src/types";

export type MemoriesLoadState = "loading" | "ready" | "error" | "no_partner";

export interface MonthGroup {
  monthKey: string;
  data: Memory[];
}

export interface UseMemoriesDataResult {
  loadState: MemoriesLoadState;
  errorMessage: string | null;
  hasPartner: boolean;
  coupleKey: string | null;
  memories: Memory[];
  groupedMemories: MonthGroup[];
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  daysTogether: number | null;
  anniversaryDate: string | null;
  selectedMemory: Memory | null;
  isAddModalOpen: boolean;
  isAnniversaryPickerOpen: boolean;
  handleRefresh: () => Promise<void>;
  handleLoadMore: () => Promise<void>;
  handleOpenAddModal: () => void;
  handleCloseAddModal: () => void;
  handleSelectMemory: (memory: Memory) => void;
  handleCloseDetailModal: () => void;
  handleToggleReaction: (memory: Memory) => Promise<void>;
  handleDeleteMemory: (memory: Memory) => Promise<void>;
  handleSaveAnniversaryDate: (dateStr: string) => Promise<void>;
  handleOpenAnniversaryPicker: () => void;
  handleCloseAnniversaryPicker: () => void;
  handleMemoryCreated: (newMemory: Memory) => void;
  retry: () => void;
}

export interface MemoryCardProps {
  memory: Memory;
  index: number;
  onPress: (memory: Memory) => void;
  onToggleReaction: (memory: Memory) => void;
}

export interface ResultCardProps {
  memory: Memory;
  index: number;
  onPress: (memory: Memory) => void;
  onToggleReaction: (memory: Memory) => void;
}

export interface AddMemoryBottomSheetProps {
  isOpen: boolean;
  coupleKey: string | null;
  userId: string | null;
  onClose: () => void;
  onMemoryCreated: (memory: Memory) => void;
}

export interface MemoryDetailModalProps {
  memory: Memory | null;
  currentUserId: string | null;
  onClose: () => void;
  onToggleReaction: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
}

export interface AnniversaryChipProps {
  daysTogether: number | null;
  onPress: () => void;
}
