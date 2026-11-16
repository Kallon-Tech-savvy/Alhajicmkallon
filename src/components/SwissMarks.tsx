/** Small inline marks keep the geometry consistent across OS emoji fonts. */
export function Arrow({ direction = 'up-right' }: { direction?: 'up-right' | 'down-right' }) {
  return (
    <svg
      className="swiss-mark"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={direction === 'up-right' ? 'M5 19 19 5M5 5h14v14' : 'M5 5l14 14M19 5v14H5'}
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function Asterisk() {
  return (
    <svg
      className="swiss-mark"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 1v22M1 12h22M4 4l16 16M20 4 4 20" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
