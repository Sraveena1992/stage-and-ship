import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { isOrderDelayed, PRODUCT_PHOTOS, STAGES, STAGE_LABELS, type Order } from "@/data/orders";

interface Props {
  order: Order | null;
  onClose: () => void;
  onAdvance: (id: string) => void;
}

export default function CustomerDetailsModal({ order, onClose, onAdvance }: Props) {
  if (!order) return null;
  const photo = PRODUCT_PHOTOS[order.photo]!;
  const nextStage = STAGES[Math.min(STAGES.indexOf(order.stage) + 1, STAGES.length - 1)]!;
  const delayed = isOrderDelayed(order);

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold tracking-tight">
            {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-foreground">{order.customer}</p>
            <p className="mt-1 font-mono text-base font-semibold text-muted-foreground">{order.phone}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {order.priority === "rush" && (
              <span className="rush-pulse rounded-md bg-rush px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide text-rush-foreground">
                Rush
              </span>
            )}
            {delayed && (
              <span className="rounded-md bg-delayed px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide text-delayed-foreground">
                Delayed
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 text-base text-muted-foreground">{order.address}</p>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 p-3">
          <img
            src={photo.src}
            alt={order.product}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-xl border border-border bg-secondary object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">{order.product}</p>
            <p className="mt-1 font-mono text-base font-bold tracking-tight text-foreground">BIN: {order.bin}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-base">
          <div className="rounded-xl bg-secondary/50 p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Courier</dt>
            <dd className="mt-1 font-bold text-foreground">{order.courier}</dd>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Order Time</dt>
            <dd className="mt-1 font-bold text-foreground">
              {new Date(order.orderTime).toLocaleString(undefined, {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Stage</dt>
            <dd className="mt-1 font-bold text-foreground">{STAGE_LABELS[order.stage]}</dd>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Barcode</dt>
            <dd className="mt-1 font-mono font-bold text-foreground">{order.barcode}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild variant="outline" className="h-auto flex-1 rounded-xl border-2 px-3 py-3 text-base font-bold uppercase tracking-wide">
            <a href={`tel:${order.phone.replace(/\s/g, "")}`}>
              <Phone className="size-5" aria-hidden /> Call Customer
            </a>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-1 rounded-xl border-2 px-3 py-3 text-base font-bold uppercase tracking-wide">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin className="size-5" aria-hidden /> View Location
            </a>
          </Button>
          {order.stage !== "shipped" && (
            <Button
              onClick={() => {
                onAdvance(order.id);
                onClose();
              }}
              className="h-auto flex-1 rounded-xl px-3 py-3 text-base font-bold uppercase tracking-wide"
            >
              Move to {STAGE_LABELS[nextStage]} →
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
