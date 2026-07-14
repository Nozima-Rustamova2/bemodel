"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { getAdminPress, updatePressPost, deletePressPost, assetUrl, PressPost } from "@/lib/api";

export default function AdminPressPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PressPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getAdminPress(token)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [token]);

  async function togglePublish(post: PressPost) {
    if (!token) return;
    const updated = await updatePressPost(token, post.id, { is_published: !post.is_published });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
  }

  async function handleDelete(post: PressPost) {
    if (!token) return;
    if (!confirm(`Удалить «${post.title}»? Это действие нельзя отменить.`)) return;
    await deletePressPost(token, post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  }

  if (loading) return <p className="text-taupe text-sm">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Пресса ({posts.length})</h1>
        <Link
          href="/admin/press/new"
          className="bg-ink text-paper px-4 py-2 text-sm eyebrow hover:bg-accent transition-colors"
        >
          + Добавить публикацию
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-taupe text-sm">Публикаций пока нет.</p>
      ) : (
        <div className="divide-y divide-hairline border-y border-hairline">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 py-4">
              <div className="relative w-14 h-16 bg-hairline flex-shrink-0">
                {post.cover_url && (
                  <Image src={assetUrl(post.cover_url)} alt={post.title} fill sizes="56px" className="object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-tight">{post.title}</p>
                {post.excerpt && <p className="text-taupe text-xs mt-0.5 truncate">{post.excerpt}</p>}
              </div>

              <span
                className={`text-xs px-2 py-1 eyebrow ${
                  post.is_published ? "bg-ink text-paper" : "bg-hairline text-taupe"
                }`}
              >
                {post.is_published ? "Опубликовано" : "Черновик"}
              </span>

              <button
                onClick={() => togglePublish(post)}
                className="text-xs eyebrow hover:text-accent transition-colors"
              >
                {post.is_published ? "Снять с публикации" : "Опубликовать"}
              </button>

              <Link href={`/admin/press/${post.id}`} className="text-xs eyebrow hover:text-accent transition-colors">
                Изменить
              </Link>

              <button
                onClick={() => handleDelete(post)}
                className="text-xs eyebrow text-accent/70 hover:text-accent transition-colors"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
