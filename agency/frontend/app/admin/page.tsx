"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getAdminModels, getAdminScouting, ModelDetail, ScoutingSubmission } from "@/lib/api";
import { card, cardStyle, colors } from "@/lib/adminTheme";

export default function AdminDashboard() {
  const { token } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<ModelDetail[]>([]);
  const [submissions, setSubmissions] = useState<ScoutingSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAdminModels(token), getAdminScouting(token)])
      .then(([m, s]) => {
        setModels(m);
        setSubmissions(s);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <p className="text-sm" style={{ color: colors.text }}>
        Загрузка…
      </p>
    );

  const modelCount = models.filter((m) => m.category === "Model").length;
  const newFaces = models.filter((m) => m.category === "New Faces").length;
  const newApplications = submissions.filter((s) => s.status === "new").length;

  const stats = [
    { label: "Всего моделей", value: models.length },
    { label: "Модели", value: modelCount },
    { label: "Новые лица", value: newFaces },
    { label: "Новые заявки", value: newApplications },
  ];

  const quickLinks = [
    { title: "Добавить модель", sub: "Создать новый профиль", go: () => router.push("/admin/models/new") },
    { title: "Редактировать главную страницу", sub: "Видео, заголовок и подборка", go: () => router.push("/admin/homepage") },
    { title: "Редактировать академию", sub: "Программа и вопросы", go: () => router.push("/admin/academy") },
    { title: "Просмотреть заявки", sub: `Всего: ${submissions.length}`, go: () => router.push("/admin/scouting") },
    { title: "Редактировать страницу «О нас»", sub: "История агентства и процесс", go: () => router.push("/admin/about") },
  ];

  return (
    <div>
      <div className="text-2xl font-semibold mb-1">Дашборд</div>
      <div className="text-sm mb-8" style={{ color: colors.text }}>
        Обзор контента сайта bemodel.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-9">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-5`} style={cardStyle}>
            <div className="text-xs mb-2" style={{ color: colors.text }}>
              {s.label}
            </div>
            <div className="text-[28px] font-semibold leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="text-[15px] font-semibold mb-3.5">Быстрые ссылки</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {quickLinks.map((q) => (
          <div
            key={q.title}
            onClick={q.go}
            className={`${card} p-[18px] cursor-pointer transition-colors hover:!border-[#6C55B0]`}
            style={cardStyle}
          >
            <div className="text-sm font-medium mb-1">{q.title}</div>
            <div className="text-xs" style={{ color: colors.text }}>
              {q.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
