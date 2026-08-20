import React from 'react';

/**
 * Initials-based artist avatar built from the artist's accent colour.
 *
 * Deliberately not an <img>: demo artists are fictional characters with no
 * real photography, and generating the mark from the accent keeps the app
 * free of external image hosts (no next.config domain allowlist, no CDN
 * dependency, works offline).
 */
export function ArtistAvatar({
  name,
  accent = '#00C2FF',
  src,
  size = 56,
  rounded = 'full',
  className = '',
}: {
  name: string;
  accent?: string | null;
  src?: string | null;
  size?: number;
  rounded?: 'full' | 'xl';
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const radius = rounded === 'full' ? '9999px' : `${Math.round(size * 0.22)}px`;
  const a = accent ?? '#00C2FF';

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size, borderRadius: radius }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`flex items-center justify-center flex-shrink-0 font-extrabold text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: size * 0.36,
        letterSpacing: '-0.02em',
        background: `linear-gradient(135deg, ${a}, ${a}22 60%, #111)`,
        boxShadow: `inset 0 0 0 1px ${a}55, 0 0 ${size * 0.35}px ${a}22`,
      }}
    >
      {initials}
    </div>
  );
}
