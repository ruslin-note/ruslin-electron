import addon from "@/lib/addon";
import { createSignal } from "solid-js";

export const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount((c) => addon.add(c, 1))}>
      Count value is {count()}
    </button>
  );
};
