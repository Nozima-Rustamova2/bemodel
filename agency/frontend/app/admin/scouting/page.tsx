"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { getAdminScouting, updateScoutingStatus, deleteScoutingSubmission, assetUrl, ScoutingSubmission } from "@/lib/api";
import { card, cardStyle, colors, dangerBtn, dangerBtnStyle } from "@/lib/adminTheme";

export default function AdminScoutingPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<ScoutingSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminScouting(token)
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [token]);

  async function toggleStatus(s: ScoutingSubmission) {
    if (!token) return;
    const next = s.status === "reviewed" ? "new" : "reviewed";
    const updated = await updateScoutingStatus(token, s.id, next);
    setSubmissions((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
  }

  async function handleDelete(s: ScoutingSubmission) {
    if (!token) return;
    if (!confirm(`Удалить заявку от ${s.name}?`)) return;
    await deleteScoutingSubmission(token, s.id);
    setSubmissions((prev) => prev.filter((x) => x.id !== s.id));
  }

  if (loading)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Заявки</div>
      <div className="text-sm mb-7" style={{ color: colors.text }}>
        Заявки с формы «Стать моделью» и сообщения со страницы «Контакты».
      </div>

      {submissions.length === 0 ? (
        <div
          className="border border-dashed rounded-[10px] p-12 text-center text-sm"
          style={{ borderColor: colors.inputBorder, color: colors.text }}
        >
          Пока ничего нет — заявки и сообщения появятся здесь.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {submissions.map((s) => {
            const reviewed = s.status === "reviewed";
            return (
              <div key={s.id} className={`${card} p-5`} style={cardStyle}>
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="text-base font-semibold">{s.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: colors.text }}>
                      {new Date(s.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{ background: colors.placeholder, color: colors.text }}
                    >
                      {s.source === "contact" ? "Контакты" : "Стать моделью"}
                    </span>
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{
                        background: reviewed ? colors.reviewedBg : colors.newBg,
                        color: reviewed ? colors.reviewedText : colors.accent,
                      }}
                    >
                      {reviewed ? "Рассмотрено" : "Новая"}
                    </span>
                    <button
                      onClick={() => toggleStatus(s)}
                      className="px-3 py-1.5 border rounded-[6px] text-xs cursor-pointer"
                      style={{ borderColor: colors.inputBorder }}
                    >
                      {reviewed ? "Отметить как новую" : "Отметить как рассмотренную"}
                    </button>
                    <button onClick={() => handleDelete(s)} className={dangerBtn} style={dangerBtnStyle}>
                      Удалить
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[13px] mb-2.5">
                  <div>
                    <span style={{ color: colors.text }}>Email</span>
                    <br />
                    {s.email}
                  </div>
                  <div>
                    <span style={{ color: colors.text }}>Телефон</span>
                    <br />
                    {s.phone || "—"}
                  </div>
                  <div>
                    <span style={{ color: colors.text }}>Instagram</span>
                    <br />
                    {s.instagram || "—"}
                  </div>
                  <div>
                    <span style={{ color: colors.text }}>Город</span>
                    <br />
                    {s.city || "—"}
                  </div>
                  <div>
                    <span style={{ color: colors.text }}>Дата рождения</span>
                    <br />
                    {s.birthdate || "—"}
                  </div>
                  <div>
                    <span style={{ color: colors.text }}>Рост</span>
                    <br />
                    {s.height || "—"}
                  </div>
                </div>

                {s.message && (
                  <div className="text-[13px] rounded-[7px] p-3 mb-2.5" style={{ background: "#F3EEFB", color: "#3D3550" }}>
                    {s.message}
                  </div>
                )}

                {s.photo_urls.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {s.photo_urls.map((url, i) => (
                      <div key={i} className="relative w-14 h-16 rounded-[6px] overflow-hidden" style={{ background: colors.placeholder }}>
                        <Image src={assetUrl(url)} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
