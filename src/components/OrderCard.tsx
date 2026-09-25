import { STAGE_LABELS, type Order } from "@/data/orders";

const STAGE_ACCENTS: Record<string, string> = {
  received: "bg-stage-received",
  picking: "bg-stage-picking",
  packing: "bg-stage-packing",
  staging: "bg-stage-staging",
  shipped: "bg-stage-shipped",
};

const STAGE_TEXT: Record<string, string> = {
  received: "text-stage-received",
  picking: "text-stage-picking",
  packing: "text-stage-packing",
  staging: "text-stage-staging",
  shipped: "text-stage-shipped",
};

interface Props {
  order: Order;
  columnStage: string;
  flashing?: boolean;
  onAdvance: (id: string) => void;
}

export default function OrderCard({ order, columnStage, flashing, onAdvance }: Props) {
  const photo = PHOTOS[order.photo];

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", order.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`card-shadow group cursor-grab rounded-2xl border-2 border-border bg-card p-4 active:cursor-grabbing ${
        flashing ? "scan-flash outline-4 outline-offset-2" : ""
      } ${order.priority === "rush" ? "border-rush/60" : ""}`}
      aria-label={`${order.id}, ${order.customer}, ${order.product}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            {order.id}
          </p>
          <p className="mt-0.5 truncate text-lg font-medium text-muted-foreground">
            {order.customer}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {order.priority === "rush" && (
            <span className="rounded-md bg-rush px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide text-rush-foreground">
              Rush
            </span>
          )}
          {order.delayed && (
            <span className="rounded-md bg-delayed px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide text-delayed-foreground">
              Delayed
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <img
          src={photo.src}
          alt={order.product}
          loading="lazy"
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-xl border border-border bg-secondary object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">{order.product}</p>
          <p className="mt-1 font-mono text-base font-bold tracking-tight text-foreground">
            BIN: {order.bin}
          </p>
        </div>
      </div>

      {order.stage !== "shipped" && (
        <button
          onClick={() => onAdvance(order.id)}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-base font-bold uppercase tracking-wide transition-colors ${STAGE_TEXT[order.stage]} border-current/30 hover:bg-secondary`}
          title={`Move to ${nextLabel(order.stage)}`}
        >
          Move to {nextLabel(order.stage)}
          <span aria-hidden>→</span>
        </button>
      )}
      {order.stage === "shipped" && columnStage === "shipped" && (
        <p className="mt-3 text-center text-base font-bold uppercase tracking-wide text-stage-shipped">
          ✓ Out the door
        </p>
      )}
    </article>
  );
}

import { PRODUCT_PHOTOS as PHOTOS } from "@/data/orders";

function nextLabel(stage: Order["stage"]) {
  const flow = ["Received", "Picking", "Packing", "Staging", "Shipped"];
  return flow[flow.indexOf(STAGE_LABELS[stage]) + 1] ?? "";
}

export { STAGE_ACCENTS };
