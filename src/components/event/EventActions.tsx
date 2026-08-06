"use client";

export function EventActions({
  contactLabel,
  reportLabel,
  onContact,
  onReport,
}: {
  contactLabel: string;
  reportLabel: string;
  onContact?: () => void;
  onReport?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={onContact}
        className="text-muted hover:text-foreground -ml-1 rounded-md px-1 py-0.5 text-sm transition-colors"
      >
        {contactLabel}
      </button>
      <button
        type="button"
        onClick={onReport}
        className="text-muted hover:text-foreground -ml-1 rounded-md px-1 py-0.5 text-sm transition-colors"
      >
        {reportLabel}
      </button>
    </div>
  );
}
