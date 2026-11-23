export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M24 36c0-7 5.2-11 5.2-16.2a5.2 5.2 0 0 0-10.4 0C18.8 25 24 29 24 36z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M24 28.5c-3.4-2.2-7.6-2-10.4.4 3.6.6 6.8-.2 10.4-3.6 3.6 3.4 6.8 4.2 10.4 3.6-2.8-2.4-7-2.6-10.4-.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
