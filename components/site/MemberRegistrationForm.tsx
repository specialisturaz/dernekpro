"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const TURKISH_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara",
  "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
  "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
  "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
  "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
  "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya",
  "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt",
  "Sinop", "Şırnak", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli",
  "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];

const inputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const errorInputClass =
  "w-full px-4 py-3 rounded-[var(--border-radius)] border border-red-400 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  tcNo: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  occupation: string;
  education: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptKvkk: boolean;
}

export default function MemberRegistrationForm() {
  const { registerMember, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    tcNo: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    occupation: "",
    education: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptKvkk: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) clearError();
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!form.fullName || form.fullName.trim().length < 2) {
      errors.fullName = "Ad soyad en az 2 karakter olmalıdır";
    }
    if (!form.email) {
      errors.email = "E-posta adresi zorunludur";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Geçerli bir e-posta adresi girin";
    }
    if (!form.phone || form.phone.length < 10) {
      errors.phone = "Geçerli bir telefon numarası girin";
    }
    if (form.tcNo && form.tcNo.length !== 11) {
      errors.tcNo = "TC Kimlik No 11 haneli olmalıdır";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!form.password || form.password.length < 8) {
      errors.password = "Şifre en az 8 karakter olmalıdır";
    } else {
      if (!/[A-Z]/.test(form.password)) errors.password = "En az bir büyük harf içermelidir";
      else if (!/[a-z]/.test(form.password)) errors.password = "En az bir küçük harf içermelidir";
      else if (!/[0-9]/.test(form.password)) errors.password = "En az bir rakam içermelidir";
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Şifreler eşleşmiyor";
    }
    if (!form.acceptTerms) {
      errors.acceptTerms = "Tüzüğü kabul etmelisiniz";
    }
    if (!form.acceptKvkk) {
      errors.acceptKvkk = "KVKK metnini onaylamalısınız";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const payload: Record<string, unknown> = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      acceptTerms: form.acceptTerms,
      acceptKvkk: form.acceptKvkk,
    };

    if (form.tcNo) payload.tcNo = form.tcNo;
    if (form.birthDate) payload.birthDate = form.birthDate;
    if (form.gender) payload.gender = form.gender;
    if (form.address) payload.address = form.address.trim();
    if (form.city) payload.city = form.city;
    if (form.occupation) payload.occupation = form.occupation.trim();
    if (form.education) payload.education = form.education;

    const result = await registerMember(payload);

    if (result.success) {
      setSuccess(true);
      setSuccessMessage(result.message);
    }
  };

  if (success) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
          Başvurunuz Alındı!
        </h2>
        <p className="text-muted mb-6">{successMessage}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Başvurunuzun durumunu takip etmek için size e-posta ile bilgi verilecektir.
            Yönetim kurulu onayından sonra hesabınıza giriş yapabilirsiniz.
          </p>
        </div>
        <Link href="/giris" className="btn-primary inline-block px-8 py-3">
          Giriş Sayfasına Git
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted"}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-muted"
          }`}>1</span>
          <span className="text-sm font-semibold hidden sm:inline">Kişisel Bilgiler</span>
        </div>
        <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted"}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-muted"
          }`}>2</span>
          <span className="text-sm font-semibold hidden sm:inline">Şifre ve Onay</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                Kişisel Bilgiler
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Ad ve soyadınız"
                    className={fieldErrors.fullName ? errorInputClass : inputClass}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    T.C. Kimlik No
                  </label>
                  <input
                    type="text"
                    value={form.tcNo}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                      updateField("tcNo", v);
                    }}
                    placeholder="11 haneli T.C. kimlik numaranız"
                    maxLength={11}
                    className={fieldErrors.tcNo ? errorInputClass : inputClass}
                  />
                  {fieldErrors.tcNo && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.tcNo}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => updateField("birthDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Cinsiyet
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Seçiniz</option>
                      <option value="MALE">Erkek</option>
                      <option value="FEMALE">Kadın</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="ornek@email.com"
                    className={fieldErrors.email ? errorInputClass : inputClass}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="0 (5XX) XXX XX XX"
                    className={fieldErrors.phone ? errorInputClass : inputClass}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Adres
                  </label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="İkamet adresiniz"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      İl
                    </label>
                    <select
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">İl seçiniz</option>
                      {TURKISH_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Meslek
                    </label>
                    <input
                      type="text"
                      value={form.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                      placeholder="Mesleğiniz"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Eğitim Durumu
                  </label>
                  <select
                    value={form.education}
                    onChange={(e) => updateField("education", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seçiniz</option>
                    <option value="İlkokul">İlkokul</option>
                    <option value="Ortaokul">Ortaokul</option>
                    <option value="Lise">Lise</option>
                    <option value="Ön Lisans">Ön Lisans</option>
                    <option value="Lisans">Lisans</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary w-full text-base py-3.5"
            >
              Devam Et
            </button>
          </div>
        )}

        {/* Step 2: Password & Confirmation */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                Şifre Oluşturun
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Şifre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="En az 8 karakter"
                      className={fieldErrors.password ? errorInputClass : inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  )}
                  <div className="flex gap-1 mt-2">
                    {[
                      form.password.length >= 8,
                      /[A-Z]/.test(form.password),
                      /[a-z]/.test(form.password),
                      /[0-9]/.test(form.password),
                    ].map((ok, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          ok ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Şifre Tekrar <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Şifrenizi tekrar girin"
                      className={fieldErrors.confirmPassword ? errorInputClass : inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Onaylar */}
            <div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                Onaylar
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptKvkk}
                    onChange={(e) => updateField("acceptKvkk", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    <a href="#" className="text-primary underline">
                      KVKK Aydınlatma Metnini
                    </a>{" "}
                    okudum ve kabul ediyorum.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {fieldErrors.acceptKvkk && (
                  <p className="text-red-500 text-xs ml-7">{fieldErrors.acceptKvkk}</p>
                )}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => updateField("acceptTerms", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    <a href="#" className="text-primary underline">
                      Dernek tüzüğünü
                    </a>{" "}
                    okudum ve kabul ediyorum.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {fieldErrors.acceptTerms && (
                  <p className="text-red-500 text-xs ml-7">{fieldErrors.acceptTerms}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline flex-1 py-3.5"
              >
                Geri Dön
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Gönderiliyor...
                  </span>
                ) : (
                  "Başvurumu Gönder"
                )}
              </button>
            </div>

            <p className="text-xs text-muted text-center mt-2">
              Başvurunuz en geç 7 iş günü içerisinde değerlendirilecektir.
            </p>
          </div>
        )}
      </form>

      {/* Giriş Linki */}
      <p className="text-center text-sm text-muted mt-6 pt-4 border-t border-border">
        Zaten üye misiniz?{" "}
        <Link href="/giris" className="text-primary font-semibold hover:underline">
          Giriş Yapın
        </Link>
      </p>
    </div>
  );
}
