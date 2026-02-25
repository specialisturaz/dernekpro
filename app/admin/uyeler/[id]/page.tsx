"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface MemberDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  tcNo: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  occupation: string | null;
  education: string | null;
  photo: string | null;
  status: string;
  joinedAt: string | null;
  createdAt: string;
  memberType: { name: string } | null;
  dues: Array<{ id: string; period: string; amount: number; status: string; paidAt: string | null }>;
  donations: Array<{ id: string; amount: number; donationType: string; status: string; createdAt: string }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  PASSIVE: "bg-gray-100 text-gray-800",
  SUSPENDED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  ACTIVE: "Aktif",
  PASSIVE: "Pasif",
  SUSPENDED: "Askıda",
  REJECTED: "Reddedildi",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/members/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMember(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success && member) {
        setMember({ ...member, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMember = async () => {
    if (!confirm("Bu üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${params.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) router.push("/admin/uyeler");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="card p-6 h-64 animate-pulse bg-gray-100" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Üye bulunamadı</p>
        <Link href="/admin/uyeler" className="text-primary hover:underline text-sm mt-2 inline-block">
          Üye listesine dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/uyeler" className="text-muted hover:text-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">{member.fullName}</h1>
            <p className="text-muted text-sm">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusColors[member.status]}`}>
            {statusLabels[member.status]}
          </span>
        </div>
      </div>

      {/* Actions */}
      {member.status === "PENDING" && (
        <div className="card p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-yellow-800 font-medium">Bu üyelik başvurusu onay bekliyor.</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus("ACTIVE")}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Onayla
              </button>
              <button
                onClick={() => updateStatus("REJECTED")}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-foreground mb-4 pb-2 border-b border-border">Kişisel Bilgiler</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Ad Soyad", value: member.fullName },
                { label: "E-posta", value: member.email },
                { label: "Telefon", value: member.phone },
                { label: "TC Kimlik No", value: member.tcNo ? "***" + member.tcNo.slice(-4) : null },
                { label: "Doğum Tarihi", value: member.birthDate ? new Date(member.birthDate).toLocaleDateString("tr-TR") : null },
                { label: "Cinsiyet", value: member.gender === "MALE" ? "Erkek" : member.gender === "FEMALE" ? "Kadın" : null },
                { label: "Meslek", value: member.occupation },
                { label: "Eğitim", value: member.education },
                { label: "Şehir", value: member.city },
                { label: "Üyelik Türü", value: member.memberType?.name },
                { label: "Başvuru Tarihi", value: new Date(member.createdAt).toLocaleDateString("tr-TR") },
                { label: "Üyelik Başlangıcı", value: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("tr-TR") : null },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value || "-"}</p>
                </div>
              ))}
            </div>
            {member.address && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted mb-0.5">Adres</p>
                <p className="text-sm text-foreground">{member.address}</p>
              </div>
            )}
          </div>

          {/* Dues */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">Aidat Geçmişi</h2>
            </div>
            {member.dues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-alt">
                    <tr>
                      <th className="text-left text-xs font-semibold text-muted uppercase px-6 py-2">Dönem</th>
                      <th className="text-left text-xs font-semibold text-muted uppercase px-6 py-2">Tutar</th>
                      <th className="text-left text-xs font-semibold text-muted uppercase px-6 py-2">Durum</th>
                      <th className="text-left text-xs font-semibold text-muted uppercase px-6 py-2">Ödeme Tarihi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {member.dues.map((due) => (
                      <tr key={due.id}>
                        <td className="px-6 py-3 text-sm">{due.period}</td>
                        <td className="px-6 py-3 text-sm">{formatCurrency(due.amount)}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            due.status === "PAID" ? "bg-green-100 text-green-800" :
                            due.status === "OVERDUE" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {due.status === "PAID" ? "Ödendi" : due.status === "OVERDUE" ? "Gecikmiş" : "Bekliyor"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-muted">
                          {due.paidAt ? new Date(due.paidAt).toLocaleDateString("tr-TR") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-muted text-sm">Aidat kaydı bulunmuyor</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="card p-6">
            <h2 className="font-bold text-foreground mb-4">Durum İşlemleri</h2>
            <div className="space-y-2">
              {member.status !== "ACTIVE" && (
                <button
                  onClick={() => updateStatus("ACTIVE")}
                  disabled={actionLoading}
                  className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  Aktif Yap
                </button>
              )}
              {member.status !== "PASSIVE" && member.status !== "PENDING" && (
                <button
                  onClick={() => updateStatus("PASSIVE")}
                  disabled={actionLoading}
                  className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Pasif Yap
                </button>
              )}
              {member.status !== "SUSPENDED" && (
                <button
                  onClick={() => updateStatus("SUSPENDED")}
                  disabled={actionLoading}
                  className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-50"
                >
                  Askıya Al
                </button>
              )}
              <hr className="my-3 border-border" />
              <button
                onClick={deleteMember}
                disabled={actionLoading}
                className="w-full text-sm font-semibold px-4 py-2.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Üyeyi Sil
              </button>
            </div>
          </div>

          {/* Donations */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">Son Bağışları</h2>
            </div>
            {member.donations.length > 0 ? (
              <div className="divide-y divide-border">
                {member.donations.map((d) => (
                  <div key={d.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(d.amount)}</p>
                      <p className="text-xs text-muted">{new Date(d.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      d.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {d.status === "COMPLETED" ? "Tamamlandı" : "Bekliyor"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-6 text-center text-muted text-sm">Bağış kaydı yok</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
