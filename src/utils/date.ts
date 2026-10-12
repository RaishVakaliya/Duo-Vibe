export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  try {
    const d1 = typeof date1 === "string" ? new Date(date1) : date1;
    const d2 = typeof date2 === "string" ? new Date(date2) : date2;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return true;
  }
}

export function formatDateChip(isoString: string | Date): string {
  try {
    const d = typeof isoString === "string" ? new Date(isoString) : isoString;
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
    if (isYesterday) return "Yesterday";

    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 7 && diffDays >= 0) {
      return d.toLocaleDateString("en-US", { weekday: "long" });
    }

    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatRelativeTime(dateOrIso: string | Date): string {
  try {
    const timeMs =
      typeof dateOrIso === "string"
        ? new Date(dateOrIso).getTime()
        : dateOrIso.getTime();
    const diff = Math.max(0, Date.now() - timeMs);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "";
  }
}

export function formatCountdown(target: string | Date | number): string {
  try {
    const targetMs =
      typeof target === "number"
        ? target > 10000000000
          ? target
          : target * 1000
        : typeof target === "string"
          ? new Date(target).getTime()
          : target.getTime();

    const now = new Date();
    const targetDate = new Date(targetMs);

    // Normalize to start of day for accurate day delta
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const compDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
    );

    const diffMs = compDate.getTime() - nowDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `in ${diffDays} days`;
  } catch {
    return "";
  }
}

export function formatPlanDate(
  dateOrIso: string | Date,
  allDay: boolean = false,
): string {
  try {
    const d =
      typeof dateOrIso === "string" ? new Date(dateOrIso) : dateOrIso;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(allDay ? {} : { hour: "numeric", minute: "2-digit" }),
    });
  } catch {
    return "";
  }
}

export function formatShortDate(dateOrIso: string | Date): string {
  try {
    const raw =
      typeof dateOrIso === "string" && !dateOrIso.includes("T")
        ? `${dateOrIso}T00:00:00`
        : dateOrIso;
    const d = typeof raw === "string" ? new Date(raw) : raw;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
