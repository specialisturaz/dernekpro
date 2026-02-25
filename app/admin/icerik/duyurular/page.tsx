"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  author: { fullName: string } | null;
}

const statusLabels: Record<string, string> = { DRAFT: "Taslak", PUBLISHED: "Yayında", ARCHIVED: "Arşiv" };
const statusColors: Record<string, string> = { DRAFT: "bg-gray-100 text-gray-800", PUBLISHED: "bg-green-100 text-green-800", ARCHIVED: "bg-yellow-100 text-yellow-800" };

export default function AnnouncementsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts?type=ANNOUNCEMENT");
      const json = await res.json();
      if (json.success) setPosts(json.data.posts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (id: string) => {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Duyurular</h1>
          <p className="text-muted text-sm">Duyuruları yönetin</p>
        </div>
        <Link href="/admin/icerik/duyurular/yeni" className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Duyuru
        </Link>
      </div>
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-muted">Henüz duyuru eklenmemiş</div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-background-alt/50">
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.title}</p>
                  <p className="text-xs text-muted">{new Date(post.createdAt).toLocaleDateString("tr-TR")} {post.author && `- ${post.author.fullName}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[post.status]}`}>{statusLabels[post.status]}</span>
                  <Link href={`/admin/icerik/duyurular/${post.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">Düzenle</Link>
                  <button onClick={() => deletePost(post.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
