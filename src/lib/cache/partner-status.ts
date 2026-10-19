import AsyncStorage from "@react-native-async-storage/async-storage";

/** Returns the storage key scoped to a specific user. */
function partnerKey(userId: string): string {
  return `duo:hasPartner:${userId}`;
}

export async function getCachedHasPartner(
  userId: string,
): Promise<boolean | null> {
  try {
    const raw = await AsyncStorage.getItem(partnerKey(userId));
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw !== null) {
      await AsyncStorage.removeItem(partnerKey(userId)).catch(() => {});
    }
    return null;
  } catch {
    return null;
  }
}

export async function setCachedHasPartner(
  userId: string,
  value: boolean,
): Promise<void> {
  try {
    await AsyncStorage.setItem(partnerKey(userId), value ? "true" : "false");
  } catch {
    // Storage failure must not propagate
  }
}

export async function clearCachedHasPartner(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(partnerKey(userId));
  } catch {
    // Storage failure must not propagate
  }
}
