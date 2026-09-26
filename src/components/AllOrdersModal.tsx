import { useState } from "react";
import { STAGES, STAGE_LABELS, isOrderDelayed, type Order, type Stage } from "@/data/orders";

const STAGE_TEXT: Record<Stage, string> = {
  received: "text-stage-received",
  picking: "text-stage-picking",
  packing: "text-stage-packing",
  staging: "text-stage-staging",
  shipped: "text-stage-shipped",
};

interface Props {
  open: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function AllOrdersModal({ open, onClose, orders }: Props) {
  const [q, setQ] = useState("");

  if (!open) return null;

  const query = q.trim().toLowerCase();
  const list = query
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.customer.toLowerCase().includes(query) ||
          o.barcode.includes(query),
      )
    : orders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="All orders today"
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-border px-6 py-4">
          <div>
            <h2 className="stage-headline text-2xl text-foreground">All Orders Today</h2>
            <p className="text-sm font-bold text-muted-foreground">{orders.length} orders in the warehouse</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-2xl font-bold text-muted-foreground hover:bg-secondary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-4">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Order ID, Customer or Barcode"
            aria-label="Search all orders"
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg font-semibold text-foreground"
          />
        </div>

        <ul className="mt-3 flex-1 overflow-y-auto px-6 pb-6">
          {STAGES.map((stage) => {
            const group = list.filter((o) => o.stage === stage);
            if (group.length === 0) return null;
            return (
              <li key={stage} className="mt-4">
                <p className={`stage-headline text-base ${STAGE_TEXT[stage]}`}>
                  {STAGE_LABELS[stage]} ({group.length})
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {group.map((o) => (
                    <li
                      key={o.id}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border-2 border-border bg-background px-4 py-3"
                    >
                      <span className="font-mono text-lg font-extrabold text-foreground">{o.id}</span>
                      <span className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
                        {o.customer} · {o.product}
                      </span>
                      {o.priority === "rush" && (
                        <span className="rounded-md bg-rush px-2 py-0.5 text-xs font-extrabold uppercase text-rush-foreground">
                          Rush
                        </span>
                      )}
                      {isOrderDelayed(o) && (
                        <span className="rounded-md bg-delayed px-2 py-0.5 text-xs font-extrabold uppercase text-delayed-foreground">
                          Delayed
                        </span>
                      )}
                      <span className={`text-sm font-extrabold uppercase ${STAGE_TEXT[stage]}`}>
                        {STAGE_LABELS[stage]}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
          {list.length === 0 && (
            <li className="py-8 text-center text-base font-semibold text-muted-foreground">No matching orders</li>
          )}
        </ul>
      </div>
    </div>
  );
}
