import { CalendarDays, Satellite } from "lucide-react";

type ProfileOverviewCardProps = {
  name?: string | null;
  email?: string | null;
  joinedAt?: Date | null;
  roleLabel: string;
};

const SATELLITE_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=400&q=80";

function toInputDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ProfileOverviewCard({
  name,
  email,
  joinedAt,
  roleLabel,
}: ProfileOverviewCardProps) {
  const joinDate = joinedAt ?? new Date();

  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={SATELLITE_PROFILE_IMAGE}
          alt="Satellite profile"
          className="h-16 w-16 rounded-full border border-border object-cover"
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {name ?? "Profile"}
          </h2>
          <p className="truncate text-sm text-muted">{email ?? "No email"}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Satellite className="h-3.5 w-3.5" />
              {roleLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              Joined {joinDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-slate-50 p-3">
          <label className="mb-1 block text-xs font-medium text-muted">Calendar</label>
          <input
            type="date"
            className="rounded-md border border-border bg-white px-2 py-1 text-xs text-foreground"
            defaultValue={toInputDateValue(new Date())}
            aria-label="Profile calendar"
          />
        </div>
      </div>
    </article>
  );
}
