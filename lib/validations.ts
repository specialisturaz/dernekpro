import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre zorunludur"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.email("Geçerli bir e-posta adresi girin"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir")
      .regex(/[0-9]/, "En az bir rakam içermelidir"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      error: "Kullanım koşullarını kabul etmelisiniz",
    }),
    acceptKvkk: z.literal(true, {
      error: "KVKK metnini onaylamalısınız",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const memberRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.email("Geçerli bir e-posta adresi girin"),
    phone: z.string().min(10, "Geçerli bir telefon numarası girin"),
    tcNo: z.string().length(11, "TC Kimlik No 11 haneli olmalıdır").optional(),
    birthDate: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    occupation: z.string().optional(),
    education: z.string().optional(),
    memberTypeId: z.string().optional(),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
      .regex(/[a-z]/, "En az bir küçük harf içermelidir")
      .regex(/[0-9]/, "En az bir rakam içermelidir"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      error: "Tüzüğü kabul etmelisiniz",
    }),
    acceptKvkk: z.literal(true, {
      error: "KVKK metnini onaylamalısınız",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MemberRegisterInput = z.infer<typeof memberRegisterSchema>;
