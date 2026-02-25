"use client";
import { useParams } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
export default function EditActivityPage() {
  const params = useParams();
  return <PostEditor postId={params.id as string} postType="ACTIVITY" backUrl="/admin/icerik/faaliyetler" typeLabelTr="Faaliyet" />;
}
