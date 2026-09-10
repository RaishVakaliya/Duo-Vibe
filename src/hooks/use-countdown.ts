import { useState, useEffect, useCallback, useRef } from "react";

export function useCountdown(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    const timer = setInterval(() => {
      if (isMountedRef.current) {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      if (isMountedRef.current) {
        setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
      }
    },
    [initialSeconds],
  );

  const formatMinutesSeconds = useCallback(
    (seconds: number = timeLeft): string => {
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
