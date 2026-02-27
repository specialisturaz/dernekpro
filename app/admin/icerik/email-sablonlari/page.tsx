"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  variables: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email-templates");
      const json = await res.json();
      if (json.success) {
        setTemplates(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplate = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      alert("Varsayılan şablonlar silinemez");
      return;
    }
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(json.message || "Silinemedi");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">E-posta Şablonları</h1>
          <p className="text-muted text-sm">E-posta şablonlarını yönetin</p>
        </div>
        <Link href="/admin/icerik/email-sablonlari/yeni" className="btn-primary px-5 py-2.5 text-sm">
          + Yeni Şablon
        </Link>
      </div>

      {/* Templates Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-muted">Henüz e-posta şablonu bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">İsim</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Konu</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Değişkenler</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Durum</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-background-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">{template.name}</p>
                      <p className="text-xs text-muted mt-0.5">{formatDate(template.updatedAt)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted hidden md:table-cell">
                      {template.subject}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.length > 0 ? (
                          template.variables.map((v) => (
                            <span key={v} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {`{{${v}}}`}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center hidden md:table-cell">
                      {template.isDefault ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                          Varsayılan
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          Özel
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/icerik/email-sablonlari/${template.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-background-alt text-muted hover:text-foreground transition-colors"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => deleteTemplate(template.id, template.isDefault)}
                          disabled={template.isDefault}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
