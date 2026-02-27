"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/* ---------- Types ---------- */
interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  coverImage: string | null;
  images: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

type FormMode = "closed" | "create" | "edit";

const CATEGORIES = ["Genel", "Etkinlik", "Proje", "Gezi", "Toplanti"] as const;

const categoryColors: Record<string, string> = {
  Genel: "bg-gray-100 text-gray-800",
  Etkinlik: "bg-blue-100 text-blue-800",
  Proje: "bg-purple-100 text-purple-800",
  Gezi: "bg-green-100 text-green-800",
  Toplanti: "bg-yellow-100 text-yellow-800",
};

const categoryLabels: Record<string, string> = {
  Genel: "Genel",
  Etkinlik: "Etkinlik",
  Proje: "Proje",
  Gezi: "Gezi",
  Toplanti: "Toplanti",
};

/* ---------- Toast ---------- */
interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastIdCounter = 0;

/* ---------- Component ---------- */
export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Genel");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Photo management
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* ---------- Fetch Albums ---------- */
  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      if (json.success) {
        setAlbums(json.data ?? json.data?.albums ?? []);
      }
    } catch (err) {
      console.error(err);
      showToast("Albumler yuklenirken hata olustu", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  /* ---------- Cover Image Upload ---------- */
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setCoverImage(json.data.url);
        setCoverPreview(json.data.url);
        showToast("Kapak gorseli yuklendi", "success");
      } else {
        showToast(json.message || "Gorsel yuklenemedi", "error");
        setCoverPreview("");
      }
    } catch {
      showToast("Gorsel yukleme sirasinda hata olustu", "error");
      setCoverPreview("");
    }

    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  /* ---------- Open Create / Edit ---------- */
  const openCreateForm = () => {
    setFormMode("create");
    setEditingAlbum(null);
    setTitle("");
    setCategory("Genel");
    setDescription("");
    setCoverImage("");
    setCoverPreview("");
  };

  const openEditForm = (album: Album) => {
    setFormMode("edit");
    setEditingAlbum(album);
    setTitle(album.title);
    setCategory(album.category);
    setDescription(album.description || "");
    setCoverImage(album.coverImage || "");
    setCoverPreview(album.coverImage || "");
  };

  const closeForm = () => {
    setFormMode("closed");
    setEditingAlbum(null);
    setTitle("");
    setCategory("Genel");
    setDescription("");
    setCoverImage("");
    setCoverPreview("");
  };

  /* ---------- Save Album (Create / Update) ---------- */
  const handleSave = async () => {
    if (!title.trim()) {
      showToast("Album basligi zorunludur", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        category,
        description: description.trim() || null,
        coverImage: coverImage || null,
      };

      const isEdit = formMode === "edit" && editingAlbum;

      const res = await fetch(
        isEdit ? `/api/admin/gallery/${editingAlbum.id}` : "/api/admin/gallery",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();

      if (json.success) {
        showToast(
          isEdit ? "Album guncellendi" : "Album olusturuldu",
          "success"
        );
        closeForm();
        fetchAlbums();
      } else {
        showToast(json.message || "Bir hata olustu", "error");
      }
    } catch {
      showToast("Islem sirasinda hata olustu", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Delete Album ---------- */
  const handleDeleteAlbum = async (album: Album) => {
    if (
      !confirm(
        `"${album.title}" albumunu silmek istediginize emin misiniz? Bu islem geri alinamaz.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/gallery/${album.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        setAlbums((prev) => prev.filter((a) => a.id !== album.id));
        if (editingAlbum?.id === album.id) closeForm();
        showToast("Album silindi", "success");
      } else {
        showToast(json.message || "Silinemedi", "error");
      }
    } catch {
      showToast("Silme sirasinda hata olustu", "error");
    }
  };

  /* ---------- Upload Photos to Album ---------- */
  const handlePhotosUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editingAlbum) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch(
        `/api/admin/gallery/${editingAlbum.id}/images`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await res.json();

      if (json.success) {
        showToast(
          `${files.length} fotograf yuklendi`,
          "success"
        );
        // Refresh albums to get updated images
        const albumRes = await fetch("/api/admin/gallery");
        const albumJson = await albumRes.json();
        if (albumJson.success) {
          const allAlbums: Album[] = albumJson.data ?? albumJson.data?.albums ?? [];
          setAlbums(allAlbums);
          const updated = allAlbums.find(
            (a: Album) => a.id === editingAlbum.id
          );
          if (updated) setEditingAlbum(updated);
        }
      } else {
        showToast(json.message || "Fotograflar yuklenemedi", "error");
      }
    } catch {
      showToast("Fotograf yukleme sirasinda hata olustu", "error");
    } finally {
      setUploadingPhotos(false);
      if (photosInputRef.current) photosInputRef.current.value = "";
    }
  };

  /* ---------- Delete Photo ---------- */
  const handleDeletePhoto = async (imageId: string) => {
    if (!editingAlbum) return;
    if (!confirm("Bu fotografi silmek istediginize emin misiniz?")) return;

    setDeletingImageId(imageId);
    try {
      const res = await fetch(
        `/api/admin/gallery/${editingAlbum.id}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (json.success) {
        const updatedImages = editingAlbum.images.filter(
          (img) => img.id !== imageId
        );
        const updatedAlbum = { ...editingAlbum, images: updatedImages };
        setEditingAlbum(updatedAlbum);
        setAlbums((prev) =>
          prev.map((a) => (a.id === editingAlbum.id ? updatedAlbum : a))
        );
        showToast("Fotograf silindi", "success");
      } else {
        showToast(json.message || "Fotograf silinemedi", "error");
      }
    } catch {
      showToast("Silme sirasinda hata olustu", "error");
    } finally {
      setDeletingImageId(null);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all animate-in slide-in-from-right ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Foto Galeri
          </h1>
          <p className="text-muted text-sm">
            Foto galeri albumlerini yonetin
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yeni Album
        </button>
      </div>

      {/* Create / Edit Form */}
      {formMode !== "closed" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {formMode === "create" ? "Yeni Album Olustur" : "Albumu Duzenle"}
            </h2>
            <button
              onClick={closeForm}
              className="w-8 h-8 rounded-lg bg-background-alt flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form Fields */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Album Basligi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Album basligini girin..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Aciklama{" "}
                  <span className="text-muted font-normal">(istege bagli)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Album hakkinda kisa bir aciklama..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Right: Cover Image */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Kapak Gorseli
              </label>
              {coverPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <div className="relative w-full h-48">
                    <Image
                      src={coverPreview}
                      alt="Kapak onizleme"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage("");
                      setCoverPreview("");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <svg
                    className="w-10 h-10 mx-auto text-muted mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-muted">
                    Kapak gorseli yuklemek icin tiklayin
                  </p>
                  <p className="text-xs text-muted mt-1">
                    JPG, PNG, WebP (maks 10MB)
                  </p>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-background-alt transition-colors"
            >
              Iptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {saving
                ? "Kaydediliyor..."
                : formMode === "create"
                ? "Album Olustur"
                : "Degisiklikleri Kaydet"}
            </button>
          </div>

          {/* Photo Management (only in edit mode) */}
          {formMode === "edit" && editingAlbum && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">
                  Fotograflar{" "}
                  <span className="text-sm font-normal text-muted">
                    ({editingAlbum.images?.length || 0})
                  </span>
                </h3>
                <button
                  onClick={() => photosInputRef.current?.click()}
                  disabled={uploadingPhotos}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {uploadingPhotos ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Yukleniyor...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Fotograf Yukle
                    </>
                  )}
                </button>
                <input
                  ref={photosInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handlePhotosUpload}
                  className="hidden"
                />
              </div>

              {editingAlbum.images && editingAlbum.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {editingAlbum.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative group rounded-lg overflow-hidden border border-border aspect-square"
                    >
                      <Image
                        src={img.url}
                        alt={img.caption || "Album fotografi"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <button
                        onClick={() => handleDeletePhoto(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingImageId === img.id ? (
                          <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <svg
                    className="w-10 h-10 mx-auto text-muted/30 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-muted">
                    Bu albumde henuz fotograf yok
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Yukle butonuyla fotograf ekleyebilirsiniz
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Albums Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted mt-3">Albumler yukleniyor...</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 text-muted/30 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-muted mb-3">Henuz album eklenmemis</p>
            <button
              onClick={openCreateForm}
              className="btn-primary px-5 py-2 text-sm inline-block"
            >
              Ilk Albumu Olustur
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Album
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                    Fotograf
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                    Tarih
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                    Islem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {albums.map((album) => (
                  <tr
                    key={album.id}
                    className="hover:bg-background-alt/50 transition-colors"
                  >
                    {/* Album info with thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-background-alt flex-shrink-0">
                          {album.coverImage ? (
                            <Image
                              src={album.coverImage}
                              alt={album.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-muted/40"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {album.title}
                          </p>
                          {album.description && (
                            <p className="text-xs text-muted truncate max-w-[200px]">
                              {album.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category badge */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          categoryColors[album.category] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {categoryLabels[album.category] || album.category}
                      </span>
                    </td>

                    {/* Photo count */}
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1.5 text-sm text-muted">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {album.images?.length || 0}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-muted">
                        {new Date(album.createdAt).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(album)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Duzenle
                        </button>
                        <button
                          onClick={() => handleDeleteAlbum(album)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
