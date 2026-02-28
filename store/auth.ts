import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  type: "user" | "member";
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string, type?: "user" | "member", rememberMe?: boolean) => Promise<boolean>;
  register: (data: Record<string, unknown>) => Promise<{ success: boolean; message: string }>;
  registerMember: (data: Record<string, unknown>) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password, type = "user", rememberMe = false) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = type === "member" ? "/api/auth/member/login" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return false;
      }

      set({
        user: { ...data.data, type },
        isLoading: false,
        error: null,
      });
      return true;
    } catch {
      set({ isLoading: false, error: "Bağlantı hatası" });
      return false;
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      set({ isLoading: false });

      if (!res.ok) {
        set({ error: data.message });
        return { success: false, message: data.message };
      }

      set({ user: { ...data.data, type: "user" } });
      return { success: true, message: data.message };
    } catch {
      set({ isLoading: false, error: "Bağlantı hatası" });
      return { success: false, message: "Bağlantı hatası" };
    }
  },

  registerMember: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/auth/member/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      set({ isLoading: false });

      if (!res.ok) {
        set({ error: data.message });
        return { success: false, message: data.message };
      }

      return { success: true, message: data.message };
    } catch {
      set({ isLoading: false, error: "Bağlantı hatası" });
      return { success: false, message: "Bağlantı hatası" };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null, error: null });
      window.location.href = "/giris";
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ user: data.data, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
