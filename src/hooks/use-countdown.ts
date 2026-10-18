import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useCountdown(
  targetTimestampOrSeconds: number,
  maxSeconds?: number,
) {
  const targetRef = useRef<number>(targetTimestampOrSeconds);
  const isMountedRef = useRef<boolean>(true);

  const calculateRemaining = useCallback((): number => {
    const target = targetRef.current;
    if (target > 1000000000) {
      // Wall clock timestamp
      const now = Date.now();
      const diff = Math.floor((target - now) / 1000);
      let remaining = Math.max(0, diff);
      if (maxSeconds && maxSeconds > 0) {
        remaining = Math.min(remaining, maxSeconds);
      }
      return remaining;
    }
    let remaining = Math.max(0, target);
    if (maxSeconds && maxSeconds > 0) {
      remaining = Math.min(remaining, maxSeconds);
    }
    return remaining;
  }, [maxSeconds]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateRemaining);

  useEffect(() => {
    targetRef.current = targetTimestampOrSeconds;
    setTimeLeft(calculateRemaining());
  }, [targetTimestampOrSeconds, calculateRemaining]);

  useEffect(() => {
    isMountedRef.current = true;

    const tick = () => {
      if (isMountedRef.current) {
        if (targetRef.current > 1000000000) {
          const now = Date.now();
          const diff = Math.floor((targetRef.current - now) / 1000);
          let remaining = Math.max(0, diff);
          if (maxSeconds && maxSeconds > 0) {
            remaining = Math.min(remaining, maxSeconds);
          }
          setTimeLeft(remaining);
        } else {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }
    };

    const timer = setInterval(tick, 1000);

    // Re-evaluate on app foregrounding (e.g. after sleep, clock adjust, or timezone switch)
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active" && isMountedRef.current) {
        tick();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
      subscription.remove();
    };
  }, [maxSeconds]);

  const reset = useCallback(
    (newTarget?: number) => {
      if (newTarget !== undefined) {
        targetRef.current = newTarget;
      }
      setTimeLeft(calculateRemaining());
    },
    [calculateRemaining],
  );

  const formatMinutesSeconds = useCallback(
    (seconds: number = timeLeft): string => {
      if (seconds >= 86400) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        return `${d}d ${h}h`;
      }
      if (seconds >= 3600) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
      }
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    },
    [timeLeft],
  );

  return {
    timeLeft,
    reset,
    formatMinutesSeconds,
    isFinished: timeLeft === 0,
  };
}
