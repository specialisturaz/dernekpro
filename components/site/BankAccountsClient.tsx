"use client";

import { useState } from "react";

interface BankAccount {
  id: string;
  bankName: string;
  bankLogo: string | null;
  accountName: string;
  iban: string;
  accountNo: string | null;
  branchName: string | null;
  branchCode: string | null;
  currency: string;
  description: string | null;
}

interface BankGroup {
  bankName: string;
  bankLogo: string | null;
  accountName: string;
  branchName: string | null;
  branchCode: string | null;
  accounts: BankAccount[];
}

const CURRENCY_LABELS: Record<string, string> = {
  TRY: "TL",
  USD: "USD",
  EUR: "EURO",
  GBP: "GBP",
};

const CURRENCY_BORDER: Record<string, string> = {
  TRY: "border-l-red-500",
  USD: "border-l-green-500",
  EUR: "border-l-blue-500",
  GBP: "border-l-purple-500",
};

const CURRENCY_BADGE: Record<string, string> = {
  TRY: "bg-red-50 text-red-700 ring-red-200",
  USD: "bg-green-50 text-green-700 ring-green-200",
  EUR: "bg-blue-50 text-blue-700 ring-blue-200",
  GBP: "bg-purple-50 text-purple-700 ring-purple-200",
};

function formatIban(iban: string): string {
  const clean = iban.replace(/\s/g, "");
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function groupByBank(accounts: BankAccount[]): BankGroup[] {
  const map = new Map<string, BankGroup>();

  for (const acc of accounts) {
    const key = acc.bankName;
    if (!map.has(key)) {
      map.set(key, {
        bankName: acc.bankName,
        bankLogo: acc.bankLogo,
        accountName: acc.accountName,
        branchName: acc.branchName,
        branchCode: acc.branchCode,
        accounts: [],
      });
    }
    map.get(key)!.accounts.push(acc);
  }

  return Array.from(map.values());
}

export default function BankAccountsClient({ accounts }: { accounts: BankAccount[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text.replace(/\s/g, "");
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Henüz hesap bilgisi eklenmemiş</h2>
        <p className="text-muted">Yakında hesap bilgileri burada yayınlanacak.</p>
      </div>
    );
  }

  const groups = groupByBank(accounts);

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div
          key={group.bankName}
          className="bg-white rounded-2xl border border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden opacity-0 animate-slide-up"
          style={{ animationDelay: `${groupIndex * 100}ms`, animationFillMode: "forwards" }}
        >
          {/* Banka Header */}
          <div className="bg-gradient-to-r from-primary/5 to-accent px-5 py-4 md:px-6 md:py-5 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-foreground truncate">{group.bankName}</h3>
                <p className="text-sm text-muted truncate">{group.accountName}</p>
              </div>
            </div>
            {/* Şube Bilgisi */}
            {(group.branchName || group.branchCode) && (
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm">
                {group.branchName && (
                  <span className="text-muted">
                    Şube: <span className="font-medium text-foreground">{group.branchName}</span>
                  </span>
                )}
                {group.branchCode && (
                  <span className="text-muted">
                    Kod: <span className="font-medium text-foreground">{group.branchCode}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Hesaplar */}
          <div className="divide-y divide-gray-100">
            {group.accounts.map((acc) => {
              const currLabel = CURRENCY_LABELS[acc.currency] || acc.currency;
              const borderColor = CURRENCY_BORDER[acc.currency] || "border-l-gray-400";
              const badgeColor = CURRENCY_BADGE[acc.currency] || "bg-gray-50 text-gray-700 ring-gray-200";
              const ibanCopyId = `iban-${acc.id}`;
              const accNoCopyId = `accno-${acc.id}`;

              return (
                <div key={acc.id} className={`border-l-4 ${borderColor} px-5 py-4 md:px-6 md:py-5`}>
                  {/* Para Birimi + Açıklama */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${badgeColor} text-xs font-bold px-3 py-1 rounded-full ring-1`}>
                      {currLabel}
                    </span>
                    {acc.description && (
                      <span className="text-xs text-muted">{acc.description}</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* IBAN Satırı */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted font-semibold uppercase tracking-wider">IBAN</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="font-mono text-base md:text-lg font-semibold text-foreground tracking-[0.08em] select-all flex-1 break-all">
                          {formatIban(acc.iban)}
                        </p>
                        <button
                          onClick={() => copyText(acc.iban, ibanCopyId)}
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 w-full sm:w-auto ${
                            copiedId === ibanCopyId
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md"
                          }`}
                        >
                          {copiedId === ibanCopyId ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Kopyalandı!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              IBAN Kopyala
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hesap No Satırı */}
                    {acc.accountNo && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted font-semibold uppercase tracking-wider">Hesap No</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <p className="font-mono text-base font-semibold text-foreground select-all flex-1">
                            {acc.accountNo}
                          </p>
                          <button
                            onClick={() => copyText(acc.accountNo!, accNoCopyId)}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 w-full sm:w-auto ${
                              copiedId === accNoCopyId
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-sm"
                            }`}
                          >
                            {copiedId === accNoCopyId ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Kopyalandı!
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Hesap No Kopyala
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
