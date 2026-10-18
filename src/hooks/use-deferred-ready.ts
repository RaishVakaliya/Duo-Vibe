import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

/** True after the current navigation transition finishes. Safe for first paint. */
export function useDeferredReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
    return () => task.cancel();
  }, []);

  return ready;
}
