// Base URL of the FastAPI backend.
// In the browser (client components) we call it directly.
// Set NEXT_PUBLIC_API_URL in .env.local — see .env.local.example
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export function assetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export interface Photo {
  id: number;
  filename: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface Video {
  id: number;
  caption: string | null;
  url: string;
  poster_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface PressPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  external_link: string | null;
  model_id: number | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface SiteSettings {
  hero_video_url: string | null;
  hero_poster_url: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  academy_headline: string | null;
  academy_subheadline: string | null;
  academy_hero_video_url: string | null;
  academy_hero_poster_url: string | null;
  manifesto_image_url: string | null;
  academy_about_image_url: string | null;

  brand_name: string | null;
  brand_city: string | null;

  hero_pre: string | null;
  hero_em: string | null;
  hero_post: string | null;
  hero_body: string | null;
  hero_subheadline_ru: string | null;
  hero_pre_ru: string | null;
  hero_em_ru: string | null;
  hero_post_ru: string | null;
  hero_body_ru: string | null;

  manifesto_title: string | null;
  manifesto_body1: string | null;
  manifesto_body2: string | null;
  manifesto_title_ru: string | null;
  manifesto_body1_ru: string | null;
  manifesto_body2_ru: string | null;

  about_heading: string | null;
  about_body1: string | null;
  about_body2: string | null;
  about_step1_title: string | null;
  about_step1_body: string | null;
  about_step2_title: string | null;
  about_step2_body: string | null;
  about_step3_title: string | null;
  about_step3_body: string | null;
  about_heading_ru: string | null;
  about_body1_ru: string | null;
  about_body2_ru: string | null;
  about_step1_title_ru: string | null;
  about_step1_body_ru: string | null;
  about_step2_title_ru: string | null;
  about_step2_body_ru: string | null;
  about_step3_title_ru: string | null;
  about_step3_body_ru: string | null;

  academy_about_title: string | null;
  academy_about_body1: string | null;
  academy_about_body2: string | null;
  academy_weeks: string | null;
  academy_sessions: string | null;
  academy_cohort: string | null;
  academy_headline_ru: string | null;
  academy_subheadline_ru: string | null;
  academy_about_title_ru: string | null;
  academy_about_body1_ru: string | null;
  academy_about_body2_ru: string | null;
}

export interface FeaturedShoot {
  id: number;
  sort_order: number;
  model_id: number | null;
  credit: string | null;
  image_url: string | null;
  model: ModelListItem | null;
}

export interface EditorialPhoto {
  id: number;
  url: string;
  sort_order: number;
}

export interface EditorialAlbum {
  id: number;
  sort_order: number;
  title: string | null;
  photos: EditorialPhoto[];
}

export interface AcademyLesson {
  id: number;
  title: string;
  note: string | null;
  title_ru: string | null;
  note_ru: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface AcademyFaq {
  id: number;
  question: string;
  answer: string | null;
  question_ru: string | null;
  answer_ru: string | null;
  sort_order: number;
}

export interface Academy {
  lessons: AcademyLesson[];
  faqs: AcademyFaq[];
}

export interface ScoutingSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  birthdate: string | null;
  height: string | null;
  instagram: string | null;
  message: string | null;
  status: "new" | "reviewed" | "archived";
  photo_urls: string[];
  created_at: string;
}

export interface ModelListItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  city: string | null;
  height: string | null;
  bust: string | null;
  waist: string | null;
  hips: string | null;
  shoes: string | null;
  hair: string | null;
  eyes: string | null;
  is_published: boolean;
  is_featured: boolean;
  cover_photo_url: string | null;
}

export interface ModelDetail {
  id: number;
  slug: string;
  name: string;
  category: string;
  city: string | null;
  bio: string | null;
  height: string | null;
  bust: string | null;
  waist: string | null;
  hips: string | null;
  shoes: string | null;
  eyes: string | null;
  hair: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  photos: Photo[];
  videos: Video[];
}

// ---------- Public (no auth) ----------

export async function getModels(category?: string): Promise<ModelListItem[]> {
  const url = new URL(`${API_URL}/api/public/models`);
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load models");
  return res.json();
}

export async function getFeaturedModels(): Promise<ModelListItem[]> {
  const res = await fetch(`${API_URL}/api/public/models/featured`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load featured models");
  return res.json();
}

export async function getModelBySlug(slug: string): Promise<ModelDetail> {
  const res = await fetch(`${API_URL}/api/public/models/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Model not found");
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/public/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function getPress(): Promise<PressPost[]> {
  const res = await fetch(`${API_URL}/api/public/press`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load press posts");
  return res.json();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/api/public/settings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load site settings");
  return res.json();
}

export async function getAcademy(): Promise<Academy> {
  const res = await fetch(`${API_URL}/api/public/academy`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load academy content");
  return res.json();
}

export async function getEditorialAlbums(): Promise<EditorialAlbum[]> {
  const res = await fetch(`${API_URL}/api/public/editorial-albums`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load editorial albums");
  return res.json();
}

export async function getFeaturedShoots(): Promise<FeaturedShoot[]> {
  const res = await fetch(`${API_URL}/api/public/featured-shoots`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load featured shoots");
  return res.json();
}

export interface ScoutingFormValues {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  birthdate?: string;
  height?: string;
  instagram?: string;
  message?: string;
}

export async function submitScouting(values: ScoutingFormValues, photos: File[]): Promise<void> {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value) form.append(key, value);
  });
  photos.forEach((f) => form.append("photos", f));

  const res = await fetch(`${API_URL}/api/public/scouting`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Failed to submit. Please try again.");
}

// ---------- Admin (auth required) ----------

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

const ADMIN_TOKEN_STORAGE_KEY = "agency_admin_token";

// Wraps every authenticated admin request: a 401 means the token is missing/expired,
// so we clear it and bounce to the login screen instead of leaving the caller to
// throw an unhandled "Failed to load X" error into the console.
async function adminFetch(input: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401 && typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    if (window.location.pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }
  return res;
}

export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  const data = await res.json();
  return data.access_token;
}

export async function getAdminModels(token: string): Promise<ModelDetail[]> {
  const res = await adminFetch(`${API_URL}/api/admin/models`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load models");
  return res.json();
}

export async function getAdminModel(token: string, id: number): Promise<ModelDetail> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${id}`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load model");
  return res.json();
}

export async function createModel(token: string, payload: Partial<ModelDetail>): Promise<ModelDetail> {
  const res = await adminFetch(`${API_URL}/api/admin/models`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create model");
  return res.json();
}

export async function updateModel(token: string, id: number, payload: Partial<ModelDetail>): Promise<ModelDetail> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update model");
  return res.json();
}

export async function deleteModel(token: string, id: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete model");
}

export async function uploadPhotos(token: string, modelId: number, files: File[]): Promise<Photo[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/photos`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload photos");
  return res.json();
}

export async function deletePhoto(token: string, modelId: number, photoId: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/photos/${photoId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete photo");
}

export async function setCoverPhoto(token: string, modelId: number, photoId: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/photos/${photoId}/set-cover`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to set cover photo");
}

export async function reorderPhotos(token: string, modelId: number, photoIdsInOrder: number[]): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/photos/reorder`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ photo_ids_in_order: photoIdsInOrder }),
  });
  if (!res.ok) throw new Error("Failed to reorder photos");
}

// ---------- Admin: videos ----------

export async function uploadVideos(token: string, modelId: number, files: File[]): Promise<Video[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/videos`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload videos");
  return res.json();
}

export async function deleteVideo(token: string, modelId: number, videoId: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/videos/${videoId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete video");
}

export async function reorderVideos(token: string, modelId: number, videoIdsInOrder: number[]): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/models/${modelId}/videos/reorder`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ video_ids_in_order: videoIdsInOrder }),
  });
  if (!res.ok) throw new Error("Failed to reorder videos");
}

// ---------- Admin: press ----------

export async function getAdminPress(token: string): Promise<PressPost[]> {
  const res = await adminFetch(`${API_URL}/api/admin/press`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load press posts");
  return res.json();
}

export async function getAdminPressPost(token: string, id: number): Promise<PressPost> {
  const res = await adminFetch(`${API_URL}/api/admin/press/${id}`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load press post");
  return res.json();
}

export async function createPressPost(token: string, payload: Partial<PressPost>): Promise<PressPost> {
  const res = await adminFetch(`${API_URL}/api/admin/press`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create press post");
  return res.json();
}

export async function updatePressPost(token: string, id: number, payload: Partial<PressPost>): Promise<PressPost> {
  const res = await adminFetch(`${API_URL}/api/admin/press/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update press post");
  return res.json();
}

export async function deletePressPost(token: string, id: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/press/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete press post");
}

export async function uploadPressCover(token: string, id: number, file: File): Promise<PressPost> {
  const form = new FormData();
  form.append("file", file);

  const res = await adminFetch(`${API_URL}/api/admin/press/${id}/cover`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload cover image");
  return res.json();
}

// ---------- Admin: scouting inbox ----------

export async function getAdminScouting(token: string, status?: string): Promise<ScoutingSubmission[]> {
  const url = new URL(`${API_URL}/api/admin/scouting`);
  if (status) url.searchParams.set("status", status);
  const res = await adminFetch(url.toString(), { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load scouting submissions");
  return res.json();
}

export async function getAdminScoutingSubmission(token: string, id: number): Promise<ScoutingSubmission> {
  const res = await adminFetch(`${API_URL}/api/admin/scouting/${id}`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load submission");
  return res.json();
}

export async function deleteScoutingSubmission(token: string, id: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/scouting/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete submission");
}

// ---------- Admin: site settings (homepage hero) ----------

export async function getAdminSettings(token: string): Promise<SiteSettings> {
  const res = await adminFetch(`${API_URL}/api/admin/settings`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

export async function updateAdminSettings(
  token: string,
  payload: Partial<Omit<SiteSettings, "hero_video_url" | "hero_poster_url">>
): Promise<SiteSettings> {
  const res = await adminFetch(`${API_URL}/api/admin/settings`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function uploadHeroVideo(token: string, file: File): Promise<SiteSettings> {
  const form = new FormData();
  form.append("file", file);

  const res = await adminFetch(`${API_URL}/api/admin/settings/hero-video`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload hero video");
  return res.json();
}

export async function deleteHeroVideo(token: string): Promise<SiteSettings> {
  const res = await adminFetch(`${API_URL}/api/admin/settings/hero-video`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete hero video");
  return res.json();
}

export type SettingsVideoSlot = "hero" | "academy";

export async function uploadSettingsVideo(token: string, slot: SettingsVideoSlot, file: File): Promise<SiteSettings> {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch(`${API_URL}/api/admin/settings/video/${slot}`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload video");
  return res.json();
}

export async function deleteSettingsVideo(token: string, slot: SettingsVideoSlot): Promise<SiteSettings> {
  const res = await adminFetch(`${API_URL}/api/admin/settings/video/${slot}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove video");
  return res.json();
}

export type SettingsImageSlot = "manifesto" | "academy-about";

export async function uploadSettingsImage(token: string, slot: SettingsImageSlot, file: File): Promise<SiteSettings> {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch(`${API_URL}/api/admin/settings/image/${slot}`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}

export async function deleteSettingsImage(token: string, slot: SettingsImageSlot): Promise<SiteSettings> {
  const res = await adminFetch(`${API_URL}/api/admin/settings/image/${slot}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove image");
  return res.json();
}

// ---------- Admin: academy ----------

export async function getAdminLessons(token: string): Promise<AcademyLesson[]> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/lessons`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load lessons");
  return res.json();
}

export async function createLesson(
  token: string,
  payload: { title: string; note?: string }
): Promise<AcademyLesson> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/lessons`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create lesson");
  return res.json();
}

export async function updateLesson(
  token: string,
  id: number,
  payload: Partial<Pick<AcademyLesson, "title" | "note" | "title_ru" | "note_ru">>
): Promise<AcademyLesson> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/lessons/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update lesson");
  return res.json();
}

export async function deleteLesson(token: string, id: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/lessons/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete lesson");
}

export async function uploadLessonImage(token: string, id: number, file: File): Promise<AcademyLesson> {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch(`${API_URL}/api/admin/academy/lessons/${id}/image`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload lesson image");
  return res.json();
}

export async function getAdminFaqs(token: string): Promise<AcademyFaq[]> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/faqs`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load FAQs");
  return res.json();
}

export async function createFaq(token: string, payload: { question: string; answer?: string }): Promise<AcademyFaq> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/faqs`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create FAQ");
  return res.json();
}

export async function updateFaq(
  token: string,
  id: number,
  payload: Partial<Pick<AcademyFaq, "question" | "answer" | "question_ru" | "answer_ru">>
): Promise<AcademyFaq> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/faqs/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update FAQ");
  return res.json();
}

export async function deleteFaq(token: string, id: number): Promise<void> {
  const res = await adminFetch(`${API_URL}/api/admin/academy/faqs/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete FAQ");
}

// ---------- Admin: featured shoots (homepage "Latest" grid) ----------

export async function getAdminFeaturedShoots(token: string): Promise<FeaturedShoot[]> {
  const res = await adminFetch(`${API_URL}/api/admin/featured-shoots`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load featured shoots");
  return res.json();
}

export async function updateFeaturedShoot(
  token: string,
  id: number,
  payload: { model_id?: number | null; credit?: string | null }
): Promise<FeaturedShoot> {
  const res = await adminFetch(`${API_URL}/api/admin/featured-shoots/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update featured shoot");
  return res.json();
}

export async function uploadFeaturedShootPhoto(token: string, id: number, file: File): Promise<FeaturedShoot> {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch(`${API_URL}/api/admin/featured-shoots/${id}/photo`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload photo");
  return res.json();
}

export async function deleteFeaturedShootPhoto(token: string, id: number): Promise<FeaturedShoot> {
  const res = await adminFetch(`${API_URL}/api/admin/featured-shoots/${id}/photo`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove photo");
  return res.json();
}

// ---------- Admin: editorial albums (homepage "Editorial Stories" grid) ----------

export async function getAdminEditorialAlbums(token: string): Promise<EditorialAlbum[]> {
  const res = await adminFetch(`${API_URL}/api/admin/editorial-albums`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load editorial albums");
  return res.json();
}

export async function updateEditorialAlbum(token: string, id: number, payload: { title?: string | null }): Promise<EditorialAlbum> {
  const res = await adminFetch(`${API_URL}/api/admin/editorial-albums/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}

export async function uploadEditorialPhotos(token: string, albumId: number, files: File[]): Promise<EditorialAlbum> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await adminFetch(`${API_URL}/api/admin/editorial-albums/${albumId}/photos`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload photos");
  return res.json();
}

export async function deleteEditorialPhoto(token: string, albumId: number, photoId: number): Promise<EditorialAlbum> {
  const res = await adminFetch(`${API_URL}/api/admin/editorial-albums/${albumId}/photos/${photoId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to remove photo");
  return res.json();
}

export async function updateScoutingStatus(
  token: string,
  id: number,
  status: ScoutingSubmission["status"]
): Promise<ScoutingSubmission> {
  const res = await adminFetch(`${API_URL}/api/admin/scouting/${id}/status`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}
