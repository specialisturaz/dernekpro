"use client";
import { useParams } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
export default function EditAnnouncementPage() {
  const params = useParams();
  return <PostEditor postId={params.id as string} postType="ANNOUNCEMENT" backUrl="/admin/icerik/duyurular" typeLabelTr="Duyuru" />;
}
