import styles from "./SvgIllustration.module.css";

interface SvgIllustrationProps {
  type: "blueprint" | "terminal" | "microphone" | "network";
  className?: string;
}

function BlueprintSvg() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Outer frame */}
      <rect x="8" y="8" width="64" height="64" />
      {/* Inner rooms */}
      <line x1="8" y1="40" x2="50" y2="40" />
      <line x1="40" y1="8" x2="40" y2="40" />
      <line x1="50" y1="40" x2="50" y2="72" />
      {/* Door gaps */}
      <line x1="22" y1="40" x2="22" y2="46" />
      <line x1="50" y1="54" x2="56" y2="54" />
      {/* Dimension marks */}
      <line x1="12" y1="76" x2="68" y2="76" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="12" y1="74" x2="12" y2="78" strokeWidth="1" />
      <line x1="68" y1="74" x2="68" y2="78" strokeWidth="1" />
    </svg>
  );
}

function TerminalSvg() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Monitor frame */}
      <rect x="8" y="12" width="64" height="48" />
      {/* Screen */}
      <rect x="12" y="16" width="56" height="40" />
      {/* Stand */}
      <line x1="32" y1="60" x2="32" y2="68" />
      <line x1="48" y1="60" x2="48" y2="68" />
      <line x1="26" y1="68" x2="54" y2="68" />
      {/* Code lines */}
      <line x1="18" y1="26" x2="24" y2="26" />
      <line x1="26" y1="26" x2="46" y2="26" />
      <line x1="18" y1="32" x2="22" y2="32" />
      <line x1="24" y1="32" x2="40" y2="32" />
      <line x1="22" y1="38" x2="50" y2="38" />
      <line x1="18" y1="44" x2="30" y2="44" />
      {/* Cursor */}
      <rect x="32" y="43" width="6" height="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MicrophoneSvg() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Podium top */}
      <line x1="20" y1="52" x2="60" y2="52" strokeWidth="2" />
      {/* Podium body */}
      <line x1="24" y1="52" x2="28" y2="72" />
      <line x1="56" y1="52" x2="52" y2="72" />
      <line x1="28" y1="72" x2="52" y2="72" />
      {/* Microphone stand */}
      <line x1="40" y1="52" x2="40" y2="34" />
      {/* Mic head */}
      <path d="M34 34 Q34 22 40 18 Q46 22 46 34" />
      <line x1="34" y1="34" x2="46" y2="34" />
      {/* Sound waves */}
      <path d="M50 24 Q54 26 50 30" fill="none" />
      <path d="M54 20 Q60 26 54 34" fill="none" />
    </svg>
  );
}

function NetworkSvg() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Connecting lines */}
      <line x1="40" y1="20" x2="18" y2="40" />
      <line x1="40" y1="20" x2="62" y2="40" />
      <line x1="18" y1="40" x2="40" y2="60" />
      <line x1="62" y1="40" x2="40" y2="60" />
      <line x1="18" y1="40" x2="62" y2="40" />
      <line x1="40" y1="20" x2="40" y2="60" />
      {/* Nodes */}
      <circle cx="40" cy="20" r="4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="40" r="3" fill="currentColor" stroke="none" />
      <circle cx="62" cy="40" r="3" fill="currentColor" stroke="none" />
      <circle cx="40" cy="60" r="4" fill="currentColor" stroke="none" />
      {/* Smaller peripheral nodes */}
      <line x1="40" y1="20" x2="58" y2="14" />
      <circle cx="58" cy="14" r="2" fill="currentColor" stroke="none" />
      <line x1="18" y1="40" x2="10" y2="56" />
      <circle cx="10" cy="56" r="2" fill="currentColor" stroke="none" />
      <line x1="62" y1="40" x2="70" y2="56" />
      <circle cx="70" cy="56" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const illustrations = {
  blueprint: BlueprintSvg,
  terminal: TerminalSvg,
  microphone: MicrophoneSvg,
  network: NetworkSvg,
} as const;

export function SvgIllustration({ type, className }: SvgIllustrationProps) {
  const Illustration = illustrations[type];

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`} aria-hidden="true">
      <Illustration />
    </div>
  );
}
