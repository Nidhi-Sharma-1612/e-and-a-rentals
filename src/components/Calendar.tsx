"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, toISODate } from "@/lib/date";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MAX_MONTHS_AHEAD = 18;

type CalendarProps = {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (next: { checkIn: string | null; checkOut: string | null }) => void;
  minDate: string;
  unavailable: Set<string>;
  maxHeight?: number;
  minNights?: number;
};

export default function Calendar({
  checkIn,
  checkOut,
  onChange,
  minDate,
  unavailable,
  maxHeight,
  minNights = 1,
}: CalendarProps) {
  const minMonth = startOfMonth(new Date(`${minDate}T00:00:00`));
  // Some homes are blocked out for long stretches (an owner block, an
  // extended-stay tenant, etc). Rather than open on the current month and
  // force guests to click "next" blindly through a year of greyed-out
  // days, jump straight to the first month that actually has something open.
  const initial = checkIn
    ? startOfMonth(new Date(`${checkIn}T00:00:00`))
    : (firstAvailableMonth(minMonth, minDate, unavailable, MAX_MONTHS_AHEAD) ?? minMonth);

  const [viewedMonth, setViewedMonth] = useState(initial);
  const today = toISODate(new Date());

  const maxMonth = new Date(minMonth);
  maxMonth.setMonth(maxMonth.getMonth() + MAX_MONTHS_AHEAD);

  const canGoPrev = viewedMonth > minMonth;
  const canGoNext = viewedMonth < maxMonth;

  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function handleDayClick(iso: string) {
    if (!checkIn || checkOut) {
      onChange({ checkIn: iso, checkOut: null });
      return;
    }
    if (iso <= checkIn) {
      onChange({ checkIn: iso, checkOut: null });
      return;
    }
    if (iso < addDays(checkIn, minNights)) {
      // Too close to check-in to satisfy the minimum stay — ignore rather
      // than let a click set an invalid range.
      return;
    }
    onChange({ checkIn, checkOut: iso });
  }

  return (
    <div
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
      className="max-h-[min(420px,80vh)] w-[288px] overflow-y-auto rounded-xl border border-wood/40 bg-card p-3.5 shadow-lg sm:w-[300px]"
    >
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoPrev}
          onClick={() =>
            setViewedMonth((m) => {
              const next = new Date(m);
              next.setMonth(next.getMonth() - 1);
              return next;
            })
          }
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-2 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="text-sm font-semibold text-ink">
          {viewedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          disabled={!canGoNext}
          onClick={() =>
            setViewedMonth((m) => {
              const next = new Date(m);
              next.setMonth(next.getMonth() + 1);
              return next;
            })
          }
          className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-2 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <p className="pb-1.5 text-center text-[12px] font-medium text-muted">
        {!checkIn
          ? "Select a check-in date"
          : !checkOut
            ? minNights > 1
              ? `Select a check-out date (${minNights} night minimum)`
              : "Select a check-out date"
            : `${formatShort(checkIn)} – ${formatShort(checkOut)}`}
      </p>

      <div className="grid grid-cols-7 gap-y-0.5 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[11px] font-semibold text-muted">
            {day}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;

          const iso = toISODate(new Date(year, month, day));
          const isPast = iso < minDate;
          const isBlocked = unavailable.has(iso) && !isPast;
          const isTooClose =
            !!checkIn && !checkOut && !isPast && !isBlocked &&
            iso > checkIn && iso < addDays(checkIn, minNights);
          const isDisabled = isPast || isBlocked || isTooClose;
          const isCheckIn = iso === checkIn;
          const isCheckOut = iso === checkOut;
          const isInRange =
            !!checkIn && !!checkOut && iso > checkIn && iso < checkOut;
          const isToday = iso === today;

          return (
            <button
              key={iso}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDayClick(iso)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                isCheckIn || isCheckOut
                  ? "bg-terracotta font-bold text-card"
                  : isInRange
                    ? "bg-terracotta/15 font-semibold text-terracotta-dark"
                    : isDisabled
                      ? isBlocked
                        ? "cursor-not-allowed bg-wood/10 text-ink-soft/40 line-through"
                        : "cursor-not-allowed text-muted/30"
                      : "cursor-pointer text-ink hover:bg-cream-2",
                isToday && !isCheckIn && !isCheckOut ? "ring-1 ring-terracotta/50" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-wood/30 pt-2">
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-wood/60 bg-card" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-wood/40" />
            Unavailable
          </span>
        </div>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => onChange({ checkIn: null, checkOut: null })}
            className="text-xs font-semibold text-denim hover:text-denim-dark"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function formatShort(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function firstAvailableMonth(
  startMonth: Date,
  minDate: string,
  unavailable: Set<string>,
  monthsAhead: number
): Date | null {
  for (let i = 0; i < monthsAhead; i++) {
    const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISODate(new Date(month.getFullYear(), month.getMonth(), day));
      if (iso < minDate) continue;
      if (!unavailable.has(iso)) return month;
    }
  }
  return null;
}
