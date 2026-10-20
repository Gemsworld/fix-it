/**
 * Fix-it brand theme: the shared design tokens for every Fix-it app.
 *
 * Keep this file and `brand/theme.css` identical across repos. Tailwind reads
 * the CSS version; use this one where you need raw values in JS (charts,
 * canvas, emails, native apps). If you change a value, change it in both files.
 */

export const colors = {
  /** Primary brand blue. Use for primary actions, links and key UI. */
  brand: "#1747A6",
  /** Brand teal (the wrench). Secondary colour for highlights and success states. */
  teal: "#0E8F87",
  /** Dark ink. Use for body text, headings and dark surfaces. */
  ink: "#0E1B3D",
  /** Light app background. */
  surface: "#F4F6FB",
  /** Cards, sheets and inputs that sit on top of `surface`. */
  card: "#FFFFFF",
} as const;

export const fonts = {
  sans: "Plus Jakarta Sans",
  /** Brand weights. Type is set heavier than the browser default (400). */
  weights: {
    body: 500,
    label: 600,
    display: 800,
  },
} as const;

/** Corner radii in px. The brand range is 14 to 20px. */
export const radii = {
  control: 14,
  card: 16,
  panel: 20,
} as const;

/** Soft shadows tinted with ink (rgb 14 27 61) rather than pure black. */
export const shadows = {
  soft: "0 1px 2px rgb(14 27 61 / 0.04), 0 4px 12px rgb(14 27 61 / 0.06)",
  softLg: "0 2px 4px rgb(14 27 61 / 0.04), 0 12px 32px rgb(14 27 61 / 0.08)",
} as const;

export const theme = { colors, fonts, radii, shadows } as const;

export type Theme = typeof theme;
export type BrandColor = keyof typeof colors;
