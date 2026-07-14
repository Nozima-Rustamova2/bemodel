"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/lib/auth";
import { adminFont, colors } from "@/lib/adminTheme";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", match: (p: string) => p === "/admin" },
  { href: "/admin/models", label: "Модели", match: (p: string) => p.startsWith("/admin/models") },
  { href: "/admin/homepage", label: "Главная страница", match: (p: string) => p === "/admin/homepage" },
  { href: "/admin/academy", label: "Академия", match: (p: string) => p === "/admin/academy" },
  { href: "/admin/about", label: "О нас", match: (p: string) => p === "/admin/about" },
  { href: "/admin/scouting", label: "Заявки", match: (p: string) => p.startsWith("/admin/scouting") },
];

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !token && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [loading, token, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (loading || !token) {
    return (
      <div style={{ fontFamily: adminFont, background: colors.bg, minHeight: "100vh" }} className="flex items-center justify-center text-sm" >
        <span style={{ color: colors.text }}>Загрузка…</span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: adminFont, background: colors.bg, color: colors.ink, minHeight: "100vh" }} className="flex">
      {/* Sidebar */}
      <div
        className="w-[232px] shrink-0 flex flex-col p-3.5 sticky top-0 bg-white border-r"
        style={{ height: "100vh", borderColor: colors.hairline }}
      >
        <div className="px-2.5 pt-1.5 pb-6 flex items-center gap-1.5">
          <div className="relative h-[18px] w-[86px]">
            <Image src="/logo-wordmark.png" alt="bemodel" fill className="object-contain object-left" />
          </div>
          <span className="text-[13px]" style={{ color: colors.text }}>
            админ
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname || "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[7px] text-sm transition-colors"
                style={{
                  background: active ? colors.newBg : "transparent",
                  color: active ? colors.ink : colors.text,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-[2px] shrink-0"
                  style={{ background: active ? colors.accent : "#D6CDEC" }}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1" />
        <button
          onClick={logout}
          className="text-left px-3 py-2.5 rounded-[7px] text-[13px] transition-colors"
          style={{ color: colors.text }}
        >
          Выйти
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-9 md:px-11 max-w-[1180px]">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
