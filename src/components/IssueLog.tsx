import { useEffect, useState } from "react";

const KEY = "fulfillment-hub-issues-v1";
const TYPES = ["Missing stock", "Misplaced box"] as const;

interface Issue {
  id: number;
  type: (typeof TYPES)[number];
  ref: string;
  note: string;
  at: number;
}

export default function IssueLog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [type, setType] = useState<Issue["type"]>("Missing stock");
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      setIssues(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setIssues([]);
    }
  }, [open]);

  if (!open) return null;

  const save = (next: Issue[]) => {
    setIssues(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const submit = () => {
    if (!ref.trim()) return;
    save([{ id: Date.now(), type, ref: ref.trim().toUpperCase(), note: note.trim(), at: Date.now() }, ...issues]);
    setRef("");
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="stage-headline text-2xl text-foreground">⚠ Issue Log</h2>
          <button onClick={onClose} className="rounded-xl px-3 py-2 text-2xl font-bold text-muted-foreground hover:bg-secondary" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mt-4 text-base font-bold text-foreground">What happened?</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-2xl border-2 px-4 py-4 text-lg font-extrabold ${
                type === t ? "border-delayed bg-delayed text-delayed-foreground" : "border-border bg-background text-foreground"
              }`}
            >
              {t === "Missing stock" ? "📭 " : "📦 "}
              {t}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-base font-bold text-foreground">
          Order ID or Bin
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="ORD-10042 or A-12-03"
            className="mt-2 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg font-semibold text-foreground"
          />
        </label>
        <label className="mt-3 block text-base font-bold text-foreground">
          Note (optional)
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. shelf empty, box on wrong rack"
            className="mt-2 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-lg text-foreground"
          />
        </label>
        <button
          onClick={submit}
          disabled={!ref.trim()}
          className="mt-4 w-full rounded-2xl bg-primary py-4 text-xl font-extrabold uppercase tracking-wide text-primary-foreground disabled:opacity-40"
        >
          Report Issue
        </button>

        <h3 className="mt-6 text-lg font-extrabold text-foreground">Reported today ({issues.length})</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {issues.map((i) => (
            <li key={i.id} className="flex items-start justify-between gap-3 rounded-xl border-2 border-border bg-background p-3">
              <div className="min-w-0">
                <p className="font-extrabold text-foreground">
                  {i.type} · <span className="font-mono">{i.ref}</span>
                </p>
                {i.note && <p className="text-sm text-muted-foreground">{i.note}</p>}
                <p className="text-xs font-semibold text-muted-foreground">
                  {new Date(i.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <button
                onClick={() => save(issues.filter((x) => x.id !== i.id))}
                className="shrink-0 rounded-lg border-2 border-border px-3 py-1 text-sm font-bold text-foreground hover:bg-secondary"
              >
                Solved
              </button>
            </li>
          ))}
          {issues.length === 0 && <p className="text-base text-muted-foreground">No issues reported.</p>}
        </ul>
      </div>
    </div>
  );
}
