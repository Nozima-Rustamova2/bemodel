"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createPressPost, getAdminModels, ModelDetail } from "@/lib/api";
import PressForm, { emptyPressFormValues } from "@/components/PressForm";

export default function NewPressPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<ModelDetail[]>([]);

  useEffect(() => {
    if (!token) return;
    getAdminModels(token).then(setModels);
  }, [token]);

  async function handleSubmit(values: Awaited<ReturnType<typeof emptyPressFormValues>>) {
    if (!token) return;
    const post = await createPressPost(token, values);
    router.push(`/admin/press/${post.id}`);
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Добавить публикацию</h1>
      <p className="text-taupe text-sm mb-8">
        Сначала создайте публикацию, затем загрузите обложку на следующем экране.
      </p>
      <PressForm initialValues={emptyPressFormValues()} models={models} onSubmit={handleSubmit} submitLabel="Создать и добавить обложку" />
    </div>
  );
}
