"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect, useRef, useState } from "react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder = "İçeriği buraya yazın..." }: RichEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        HTMLAttributes: { class: "rich-editor-image" },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "rich-editor-link" },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content",
      },
    },
  });

  // Dışarıdan value değiştiğinde editor'ü güncelle (ilk yükleme vb)
  const isInternalChange = useRef(false);
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isInternalChange.current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // onChange'i wrap ederek internal change flag'i ayarla
  useEffect(() => {
    if (editor) {
      const handler = () => {
        isInternalChange.current = true;
        onChange(editor.getHTML());
        setTimeout(() => { isInternalChange.current = false; }, 0);
      };
      editor.on("update", handler);
      return () => { editor.off("update", handler); };
    }
  }, [editor, onChange]);

  const handleImageUpload = useCallback(async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "content");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success && editor) {
        editor.chain().focus().setImage({ src: json.data.url }).run();
      }
    } catch {
      // hata
    } finally {
      setImageUploading(false);
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    if (imageUrl.trim() && editor) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl("");
      setShowImageModal(false);
    }
  }, [editor, imageUrl]);

  const insertLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkUrl("");
    setShowLinkModal(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const ToolBtn = ({ active, onClick, children, title, disabled }: {
    active?: boolean; onClick: () => void; children: React.ReactNode; title: string; disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground hover:bg-background-alt"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border mx-0.5" />;

  return (
    <div className="border border-border rounded-[var(--border-radius)] overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-background-alt/50">
        {/* Bold */}
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Kalın">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
        </ToolBtn>
        {/* Italic */}
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="İtalik">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolBtn>
        {/* Underline */}
        <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Altı Çizili">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </ToolBtn>
        {/* Strikethrough */}
        <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Üstü Çizili">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="4" y1="12" x2="20" y2="12"/><path d="M17.5 7.5c0-2-1.5-3.5-5.5-3.5S6.5 5 6.5 7.5c0 3 3 4.5 5.5 4.5"/><path d="M8.5 16.5c0 2 1.5 3.5 3.5 3.5s5.5-1 5.5-3.5"/></svg>
        </ToolBtn>

        <Divider />

        {/* H2 */}
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Başlık 2">
          <span className="font-bold text-xs">H2</span>
        </ToolBtn>
        {/* H3 */}
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Başlık 3">
          <span className="font-bold text-xs">H3</span>
        </ToolBtn>
        {/* H4 */}
        <ToolBtn active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="Başlık 4">
          <span className="font-bold text-xs">H4</span>
        </ToolBtn>

        <Divider />

        {/* Bullet List */}
        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Madde İşareti">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/></svg>
        </ToolBtn>
        {/* Ordered List */}
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numaralı Liste">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="8" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="3" y="14" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="3" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">3</text></svg>
        </ToolBtn>
        {/* Blockquote */}
        <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Alıntı">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn
          active={editor.isActive("link")}
          onClick={() => {
            const existing = editor.getAttributes("link").href || "";
            setLinkUrl(existing);
            setShowLinkModal(true);
          }}
          title="Bağlantı"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </ToolBtn>
        {/* Image */}
        <ToolBtn
          onClick={() => setShowImageModal(true)}
          title="Görsel Ekle"
          disabled={imageUploading}
        >
          {imageUploading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          )}
        </ToolBtn>

        <Divider />

        {/* Text Align */}
        <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Sola Hizala">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Ortala">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </ToolBtn>

        <Divider />

        {/* Undo/Redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Geri Al" disabled={!editor.can().undo()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Yinele" disabled={!editor.can().redo()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
        </ToolBtn>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input for image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          if (imageInputRef.current) imageInputRef.current.value = "";
        }}
        className="hidden"
      />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowImageModal(false)}>
          <div className="bg-background rounded-xl shadow-xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground">Görsel Ekle</h3>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={imageUploading}
              className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50"
            >
              {imageUploading ? "Yükleniyor..." : "Bilgisayardan Yükle"}
            </button>
            <div className="text-center text-xs text-muted">veya</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertImage()}
                placeholder="Görsel URL yapıştır..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={insertImage}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ekle
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setShowImageModal(false); setImageUrl(""); }}
              className="w-full text-sm text-muted hover:text-foreground"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-background rounded-xl shadow-xl p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground">Bağlantı Ekle</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && insertLink()}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={insertLink}
                className="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                {linkUrl.trim() ? "Uygula" : "Bağlantıyı Kaldır"}
              </button>
              <button
                type="button"
                onClick={() => { setShowLinkModal(false); setLinkUrl(""); }}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-background-alt transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
