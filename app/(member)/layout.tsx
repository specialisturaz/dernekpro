import type { Metadata } from "next";
import MemberLayoutClient from "@/components/member/MemberLayoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>;
}
