export function HeroImpulsePanel() {
  return (
    <div aria-hidden="true" className="absolute -inset-7 overflow-hidden bg-[var(--highlight)]">
      <svg
        className="h-full w-full"
        viewBox="0 0 560 552"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <pattern id="hero-panel-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(20,80,62,0.12)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="560" height="552" fill="var(--highlight)" />
        <rect width="560" height="552" fill="url(#hero-panel-grid)" />

        <circle cx="424" cy="178" r="118" fill="var(--foreground)" />
        <circle cx="126" cy="376" r="92" fill="none" stroke="rgba(20,80,62,0.24)" strokeWidth="1" />
        <circle cx="214" cy="252" r="50" fill="rgba(255,255,255,0.78)" />
        <circle
          cx="368"
          cy="358"
          r="34"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1"
        />

        <polygon points="148,112 218,232 78,232" fill="var(--foreground)" />
        <polygon
          points="270,326 362,476 178,476"
          fill="var(--accent)"
          transform="rotate(18 270 401)"
        />
        <polygon
          points="416,220 474,316 358,316"
          fill="rgba(255,255,255,0.86)"
          transform="rotate(61 416 268)"
        />
        <polygon
          points="312,284 350,348 274,348"
          fill="rgba(20,80,62,0.7)"
          transform="rotate(-24 312 316)"
        />

        <circle cx="104" cy="94" r="6" fill="var(--foreground)" />
        <circle cx="125" cy="94" r="6" fill="rgba(20,80,62,0.55)" />
      </svg>
    </div>
  );
}
