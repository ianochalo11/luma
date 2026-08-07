"use client";

/**
 * Client-side UX stand-in for Luma’s pre–sign-in “Verifying Your Browser” step.
 * Not real bot protection — timing + layout only.
 */
export function BrowserVerification() {
  return (
    <div className="relative min-h-[220px] pb-10">
      <div className="mb-5 text-[#111111]">
        <ShieldCheckIcon className="h-7 w-7" />
      </div>

      <h2 className="text-[22px] font-semibold tracking-tight text-[#111111]">
        Verifying Your Browser
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
        We&apos;re doing a quick check of your browser to keep Luma safe.
      </p>

      <div className="mt-10 flex items-center gap-2.5 text-[#6b7280]">
        <DotSpinner />
        <span className="text-sm">Verifying...</span>
      </div>

      <div className="absolute right-0 bottom-0">
        <CloudflareBadge />
      </div>
    </div>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 2.5 4.5 5.5v5.2c0 5 3.4 8.6 7.5 10.3 4.1-1.7 7.5-5.3 7.5-10.3V5.5L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Ring of gray dots that rotates — matches the reference verifying spinner. */
function DotSpinner() {
  const count = 8;
  return (
    <span
      className="relative inline-block h-5 w-5 shrink-0 animate-spin"
      style={{ animationDuration: "0.85s" }}
      aria-hidden
      role="status"
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = 7.5;
        const x = Math.sin(angle) * r;
        const y = -Math.cos(angle) * r;
        const opacity = 0.2 + (i / (count - 1)) * 0.8;
        return (
          <span
            key={i}
            className="absolute h-[3.5px] w-[3.5px] rounded-full bg-[#9ca3af]"
            style={{
              opacity,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </span>
  );
}

function CloudflareBadge() {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1.5">
        <CloudflareMark className="h-4 w-4" />
        <span className="text-[11px] font-bold tracking-wide text-[#111111]">
          CLOUDFLARE
        </span>
      </div>
      <p className="text-[10px] leading-none text-[#2563eb]">
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Privacy
        </a>
        <span className="mx-1 text-[#94a3b8]">•</span>
        <a
          href="https://www.cloudflare.com/"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Help
        </a>
      </p>
    </div>
  );
}

function CloudflareMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        fill="#F6821F"
        d="M22.8 20.4c.2-.6.3-1.2.3-1.8 0-3.1-2.5-5.6-5.6-5.6-2.2 0-4.1 1.3-5 3.1-.6-.4-1.4-.7-2.2-.7-2.1 0-3.8 1.6-4 3.7C4.4 19.4 3 21 3 22.9c0 .2 0 .3.1.5h18.9c.3-.3.6-.6.8-1z"
      />
      <path
        fill="#FBAD41"
        d="M26.4 18.1c-.3 0-.6 0-.9.1-.5-2.4-2.6-4.2-5.1-4.2-.6 0-1.2.1-1.7.3 1.4 1 2.4 2.5 2.6 4.3l.1.7h4.3c.2 0 .4.2.4.4s-.2.4-.4.4H12.8c-.3 0-.5-.2-.5-.5 0-2.3 1.8-4.1 4.1-4.1.7 0 1.3.2 1.9.5.7-2.5 3-4.3 5.7-4.3 2.9 0 5.3 2.1 5.8 4.9.9.3 1.5 1.1 1.5 2.1 0 1.2-1 2.2-2.2 2.2h-.1c-.1-.8-.5-1.5-1.1-2-.4-.3-.9-.5-1.5-.5z"
      />
    </svg>
  );
}
