"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Gorsel Yukle",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();

        if (json.success) {
          onChange(json.data.url);
        } else {
          setError(json.message || "Yukleme hatasi");
        }
      } catch {
        setError("Baglanti hatasi");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [upload]
  );

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setUrlValue("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground block">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Yuklenen gorsel"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-700 transition-colors"
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
              <span className="text-primary text-sm font-medium">
                Yukleniyor...
              </span>
            </div>
          ) : (
            <>
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
                Surukle birak veya tiklayarak sec
              </p>
              <p className="text-xs text-muted mt-1">
                JPG, PNG, WebP (maks 10MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* URL ile ekleme secenegi */}
      {!value && (
        <div>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-muted hover:text-primary transition-colors"
          >
            {showUrlInput ? "Gizle" : "veya URL yapistir"}
          </button>
          {showUrlInput && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 text-sm bg-primary text-white rounded-[var(--border-radius)] hover:bg-primary-dark transition-colors"
              >
                Ekle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
