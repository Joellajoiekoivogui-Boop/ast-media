export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-card-border border-l-[3px] border-l-primary bg-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
