// Design tokens for the admin dashboard. System-ui font stack for a
// utilitarian feel, but colored to match the public site's lavender brand
// (sampled from the bemodel logo) rather than a separate palette.
import type { CSSProperties } from "react";

export const adminFont = "system-ui, -apple-system, 'Segoe UI', sans-serif";

export const colors = {
  bg: "#EAE4F8",
  card: "#fff",
  cardBorder: "rgba(23,18,31,0.08)",
  hairline: "rgba(23,18,31,0.08)",
  inputBorder: "rgba(23,18,31,0.16)",
  ink: "#17121F",
  text: "#8478A0",
  placeholder: "#E6DFF6",
  accent: "#6C55B0",
  accentHover: "#5A4494",
  danger: "#B91C1C",
  dangerBg: "rgba(185,28,28,0.08)",
  reviewedText: "#1F8A5B",
  reviewedBg: "rgba(31,138,91,0.12)",
  newBg: "rgba(108,85,176,0.12)",
};

export const card = "bg-white border rounded-[10px]";
export const cardStyle: CSSProperties = { borderColor: colors.cardBorder };

export const sectionLabel =
  "text-[13px] font-semibold mb-4 uppercase tracking-[0.06em]";
export const sectionLabelStyle: CSSProperties = { color: colors.text };

export const label = "text-xs";
export const labelStyle: CSSProperties = { color: colors.text };

export const input =
  "px-[11px] py-[9px] border rounded-[7px] text-sm font-[inherit] outline-none w-full bg-white";
export const inputStyle: CSSProperties = { borderColor: colors.inputBorder };

export const textarea = `${input} resize-y`;

export const primaryBtn =
  "inline-flex items-center justify-center px-4 py-[9px] rounded-[7px] text-[13px] font-medium cursor-pointer transition-colors text-white";
export const primaryBtnStyle: CSSProperties = { background: colors.accent };

export const secondaryBtn =
  "inline-flex items-center justify-center px-4 py-[9px] border rounded-[7px] text-[13px] cursor-pointer transition-colors bg-white";
export const secondaryBtnStyle: CSSProperties = { borderColor: colors.inputBorder, color: colors.ink };

export const dangerBtn =
  "inline-flex items-center justify-center px-3 py-[7px] rounded-[6px] text-xs cursor-pointer transition-colors";
export const dangerBtnStyle: CSSProperties = { color: colors.danger };
