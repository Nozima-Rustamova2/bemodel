"use client";

import { label, labelStyle, input, inputStyle, textarea } from "@/lib/adminTheme";

export default function AdminBilingualField({
  labelText,
  enValue,
  ruValue,
  onSaveEn,
  onSaveRu,
  multiline = false,
  rows = 2,
}: {
  labelText: string;
  enValue: string;
  ruValue: string;
  onSaveEn: (value: string) => void;
  onSaveRu: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} style={labelStyle}>
        {labelText}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.1em]" style={{ color: "#B0A5CC" }}>
            EN
          </span>
          {multiline ? (
            <textarea
              defaultValue={enValue}
              onBlur={(e) => onSaveEn(e.target.value)}
              rows={rows}
              className={textarea}
              style={inputStyle}
            />
          ) : (
            <input
              defaultValue={enValue}
              onBlur={(e) => onSaveEn(e.target.value)}
              className={input}
              style={inputStyle}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.1em]" style={{ color: "#B0A5CC" }}>
            RU
          </span>
          {multiline ? (
            <textarea
              defaultValue={ruValue}
              onBlur={(e) => onSaveRu(e.target.value)}
              rows={rows}
              className={textarea}
              style={inputStyle}
            />
          ) : (
            <input
              defaultValue={ruValue}
              onBlur={(e) => onSaveRu(e.target.value)}
              className={input}
              style={inputStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
