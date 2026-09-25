import { useEffect, useState } from "react";
import { buildDummyOrders, type Order, type Stage } from "@/data/orders";

const STORAGE_KEY = "fulfillment-hub-orders-v2";

function load(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 50) return parsed as Order[];
    }
  } catch {
    // corrupted storage -> reseed
  }
  const seeded = buildDummyOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() =>
    typeof window === "undefined" ? buildDummyOrders() : load(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // storage full or unavailable — board keeps working in memory
    }
  }, [orders]);

  const moveOrder = (id: string, stage: Stage) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage } : o)),
    );
  };

  const advanceOrder = (id: string): Order | undefined => {
    const order = orders.find((o) => o.id === id || o.barcode === id);
    if (!order) return undefined;
    const idx = ["received", "picking", "packing", "staging", "shipped"].indexOf(order.stage);
    const next = ["received", "picking", "packing", "staging", "shipped"][Math.min(idx + 1, 4)];
    const updated = { ...order, stage: next as Stage };
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    return updated;
  };

  const findOrder = (code: string) =>
    orders.find(
      (o) =>
        o.id.toLowerCase() === code.trim().toLowerCase() ||
        o.barcode === code.trim() ||
        o.id.toLowerCase().includes(code.trim().toLowerCase()),
    );

  const resetDay = () => {
    const seeded = buildDummyOrders();
    setOrders(seeded);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  };

  return { orders, moveOrder, advanceOrder, findOrder, resetDay };
}
