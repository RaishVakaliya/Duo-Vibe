import { useState, useEffect, useCallback, useRef } from "react";

export function useCountdown(targetTimestampOrSeconds: number) {
  const calculateRemaining = useCallback((): number => {
    if (targetTimestampOrSeconds > 1000000000) {
      const diff = Math.floor((targetTimestampOrSeconds - Date.now()) / 1000);
      return Math.max(0, diff);
    }
    return Math.max(0, targetTimestampOrSeconds);
  }, [targetTimestampOrSeconds]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateRemaining);
  const isMountedRef = useRef<boolean>(true);
  const targetRef = useRef<number>(targetTimestampOrSeconds);

  useEffect(() => {
    targetRef.current = targetTimestampOrSeconds;
    setTimeLeft(calculateRemaining());
  }, [targetTimestampOrSeconds, calculateRemaining]);

  useEffect(() => {
    isMountedRef.current = true;
    const timer = setInterval(() => {
      if (isMountedRef.current) {
        if (targetRef.current > 1000000000) {
          const diff = Math.floor((targetRef.current - Date.now()) / 1000);
          setTimeLeft(Math.max(0, diff));
        } else {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, []);

  const reset = useCallback(
    (newTarget?: number) => {
      if (newTarget !== undefined) {
        targetRef.current = newTarget;
        if (newTarget > 1000000000) {
          const diff = Math.floor((newTarget - Date.now()) / 1000);
          setTimeLeft(Math.max(0, diff));
        } else {
          setTimeLeft(newTarget);
        }
      } else {
        setTimeLeft(calculateRemaining());
      }
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
