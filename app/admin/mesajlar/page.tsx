"use client";

import { useState, useEffect, useCallback } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Summary {
  total: number;
  unreadCount: number;
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/contacts?${params}`);
      const json = await res.json();
      if (json.success) {
        setContacts(json.data.contacts);
        setSummary(json.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const toggleRead = async (id: string, currentIsRead: boolean) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentIsRead }),
      });
      const json = await res.json();
      if (json.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isRead: !currentIsRead } : c))
        );
        setSummary((prev) => ({
          ...prev,
          unreadCount: currentIsRead ? prev.unreadCount + 1 : prev.unreadCount - 1,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Bu mesaji silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        const deleted = contacts.find((c) => c.id === id);
        setContacts((prev) => prev.filter((c) => c.id !== id));
        setSummary((prev) => ({
          total: prev.total - 1,
          unreadCount: deleted && !deleted.isRead ? prev.unreadCount - 1 : prev.unreadCount,
        }));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Mesajlar</h1>
          <p className="text-muted text-sm">Iletisim formundan gelen mesajlari yonetin</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Toplam Mesaj</p>
              <p className="text-xl font-bold text-foreground">{summary.total}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">Okunmamis</p>
              <p className="text-xl font-bold text-foreground">{summary.unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchContacts()}
              placeholder="Isim, e-posta veya konu ara..."
              className="w-full px-4 py-2.5 pl-10 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <svg className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button onClick={fetchContacts} className="btn-primary px-6 py-2.5 text-sm">
            Filtrele
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-muted/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-muted">Henuz mesaj bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt">
                <tr>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Isim</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">E-posta</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Konu</th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Mesaj</th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Okundu</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3 hidden md:table-cell">Tarih</th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.map((contact) => (
                  <>
                    <tr
                      key={contact.id}
                      className={`hover:bg-background-alt/50 transition-colors cursor-pointer ${
                        !contact.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleExpand(contact.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!contact.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                          <p className={`text-sm ${!contact.isRead ? "font-bold" : "font-semibold"} text-foreground`}>
                            {contact.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden md:table-cell">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell">
                        {contact.subject || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell max-w-[200px]">
                        <p className="truncate">
                          {contact.message.length > 60
                            ? contact.message.slice(0, 60) + "..."
                            : contact.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            contact.isRead
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {contact.isRead ? "Okundu" : "Yeni"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted hidden md:table-cell">
                        {new Date(contact.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleRead(contact.id, contact.isRead)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-background-alt text-muted hover:text-foreground transition-colors"
                          >
                            {contact.isRead ? "Okunmadi" : "Okundu"}
                          </button>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === contact.id && (
                      <tr key={`${contact.id}-expanded`}>
                        <td colSpan={7} className="px-6 py-4 bg-background-alt/30">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-foreground">Gonderen: </span>
                                <span className="text-muted">{contact.name}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground">E-posta: </span>
                                <span className="text-muted">{contact.email}</span>
                              </div>
                              {contact.phone && (
                                <div>
                                  <span className="font-semibold text-foreground">Telefon: </span>
                                  <span className="text-muted">{contact.phone}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-foreground">Tarih: </span>
                                <span className="text-muted">
                                  {new Date(contact.createdAt).toLocaleString("tr-TR")}
                                </span>
                              </div>
                            </div>
                            {contact.subject && (
                              <div className="text-sm">
                                <span className="font-semibold text-foreground">Konu: </span>
                                <span className="text-muted">{contact.subject}</span>
                              </div>
                            )}
                            <div className="mt-2 p-4 rounded-[var(--border-radius)] bg-background border border-border">
                              <p className="text-sm text-foreground whitespace-pre-wrap">{contact.message}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
