import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subelerimiz",
  description: "Dernegimizin Turkiye genelindeki subeleri, irtibat burolari ve temsilcilikleri. Adres, telefon ve harita bilgileri.",
  openGraph: {
    title: "Subelerimiz",
    description: "Dernegimizin Turkiye genelindeki subeleri ve temsilcilikleri.",
  },
};

export default function SubelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
