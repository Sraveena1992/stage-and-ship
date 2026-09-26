import { isOrderDelayed, PRODUCT_PHOTOS, STAGES, STAGE_LABELS, type Order, type Stage } from "@/data/orders";
import { Button } from "@/components/ui/button";

const STAGE_ACCENT: Record<Stage, { bar: string; text: string; chip: string }> = {
  received: {
    bar: "bg-stage-received",
    text: "text-stage-received",
    chip: "bg-stage-received/10 text-stage-received",
  },
  picking: {
    bar: "bg-stage-picking",
    text: "text-stage-picking",
    chip: "bg-stage-picking/15 text-stage-picking",
  },
  packing: {
    bar: "bg-stage-packing",
    text: "text-stage-packing",
    chip: "bg-stage-packing/10 text-stage-packing",
  },
  staging: {
    bar: "bg-stage-staging",
    text: "text-stage-staging",
    chip: "bg-stage-staging/10 text-stage-staging",
  },
  shipped: {
    bar: "bg-stage-shipped",
    text: "text-stage-shipped",
    chip: "bg-stage-shipped/10 text-stage-shipped",
  },
};

interface Props {
  order: Order;
  columnStage: Stage;
  flashing: boolean;
  onAdvance: (id: string) => void;
  onOpenDetails: (order: Order) => void;
  /** Active KPI filter — gives matching cards a colored highlight ring. */
  highlight?: "board" | "delayed" | undefined;
}

const HIGHLIGHT_RING = {
  board: "ring-4 ring-primary/70",
  delayed: "ring-4 ring-delayed",
} as const;

export default function OrderCard({ order, columnStage, flashing, onAdvance, onOpenDetails, highlight }: Props) {
  const photo = PRODUCT_PHOTOS[order.photo]!;
  const flow = STAGES;
  const nextStage = flow[Math.min(flow.indexOf(order.stage) + 1, flow.length - 1)]!;
  const accent = STAGE_ACCENT[order.stage]!;

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", order.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onOpenDetails(order)}
      className={`card-shadow group cursor-pointer rounded-2xl border-2 bg-card p-4 transition-colors hover:bg-secondary active:cursor-grabbing ${
        order.priority === "rush" ? "border-rush/60" : "border-border"
      } ${highlight ? HIGHLIGHT_RING[highlight] : ""} ${flashing ? "scan-flash outline-4 outline-offset-2" : ""}`}
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
            <span className="rush-pulse rounded-md bg-rush px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide text-rush-foreground">
              Rush
            </span>
          )}
          {isOrderDelayed(order) && (
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

      {order.stage !== "shipped" && columnStage === order.stage ? (
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onAdvance(order.id);
          }}
          className={`mt-3 h-auto w-full rounded-xl border-2 border-current/30 ${accent.text} px-3 py-2 text-base font-bold uppercase tracking-wide shadow-none hover:bg-secondary`}
          title={`Move to ${STAGE_LABELS[nextStage]}`}
        >
          Move to {STAGE_LABELS[nextStage]}
          <span aria-hidden>→</span>
        </Button>
      ) : (
        <p className={`mt-3 text-center text-base font-bold uppercase tracking-wide ${STAGE_ACCENT[order.stage]!.text}`}>
          {order.stage === "shipped" ? "✓ Out the door" : `In ${STAGE_LABELS[order.stage]}`}
        </p>
      )}
    </article>
  );
}
