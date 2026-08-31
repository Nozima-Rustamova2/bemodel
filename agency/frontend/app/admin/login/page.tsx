"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiUnreachableError, API_URL } from "@/lib/api";
import { adminFont, colors, input, inputStyle, primaryBtn, primaryBtnStyle } from "@/lib/adminTheme";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (e) {
      // A password the server rejected and a server the browser never reached
      // look identical from here unless we say so explicitly.
      setError(
        e instanceof ApiUnreachableError
          ? `Нет связи с сервером (${new URL(API_URL).host}). Пароль здесь ни при чём — запрос не дошёл. Проверьте интернет, VPN или антивирус.`
          : "Неверный email или пароль."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ fontFamily: adminFont, background: colors.bg, color: colors.ink, minHeight: "100vh" }}
      className="flex items-center justify-center p-6"
    >
      <div
        className="w-full max-w-[360px] bg-white border rounded-[10px] px-9 py-10"
        style={{ borderColor: colors.cardBorder }}
      >
        <div
          className="text-[13px] uppercase mb-1.5"
          style={{ letterSpacing: "0.16em", color: colors.text }}
        >
          bemodel
        </div>
        <div className="text-[22px] font-semibold mb-7">Вход в админ-панель</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: colors.text }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bemodel.uz"
              className={input}
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: colors.text }}>
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={input}
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: colors.danger }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`${primaryBtn} mt-1 disabled:opacity-50`}
            style={primaryBtnStyle}
          >
            {submitting ? "Вход…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
