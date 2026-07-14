"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import {
  getAdminPressPost,
  updatePressPost,
  uploadPressCover,
  getAdminModels,
  assetUrl,
  PressPost,
  ModelDetail,
} from "@/lib/api";
import PressForm, { emptyPressFormValues } from "@/components/PressForm";

export default function EditPressPage() {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const { token } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<PressPost | null>(null);
  const [models, setModels] = useState<ModelDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getAdminPressPost(token, postId), getAdminModels(token)])
      .then(([p, m]) => {
        setPost(p);
        setModels(m);
      })
      .finally(() => setLoading(false));
  }, [token, postId]);

  async function handleSubmit(values: Awaited<ReturnType<typeof emptyPressFormValues>>) {
    if (!token) return;
    const updated = await updatePressPost(token, postId, values);
    setPost(updated);
    router.push("/admin/press");
  }

  async function handleCoverChange(fileList: FileList | null) {
    if (!fileList || !fileList[0] || !token) return;
    setUploading(true);
    try {
      const updated = await uploadPressCover(token, postId, fileList[0]);
      setPost(updated);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (loading) return <p className="text-taupe text-sm">Загрузка...</p>;
  if (!post) return <p className="text-taupe text-sm">Публикация не найдена.</p>;

  return (
    <div className="space-y-14">
      <div>
        <h1 className="font-display text-3xl mb-8">Редактирование: {post.title}</h1>
        <PressForm
          initialValues={emptyPressFormValues(post)}
          models={models}
          onSubmit={handleSubmit}
          submitLabel="Сохранить изменения"
        />
      </div>

      <div className="max-w-2xl">
        <h2 className="font-display text-2xl mb-4">Обложка</h2>
        {post.cover_url && (
          <div className="relative w-40 aspect-[3/4] bg-hairline mb-4">
            <Image src={assetUrl(post.cover_url)} alt="" fill sizes="160px" className="object-cover" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleCoverChange(e.target.files)}
          disabled={uploading}
        />
        {uploading && <p className="text-taupe text-xs mt-2">Загрузка...</p>}
      </div>
    </div>
  );
}
