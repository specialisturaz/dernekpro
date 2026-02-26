import MemberLayoutClient from "@/components/member/MemberLayoutClient";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberLayoutClient>{children}</MemberLayoutClient>;
}
