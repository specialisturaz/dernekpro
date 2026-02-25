import PostEditor from "@/components/admin/PostEditor";
export default function NewAnnouncementPage() {
  return <PostEditor postType="ANNOUNCEMENT" backUrl="/admin/icerik/duyurular" typeLabelTr="Duyuru" />;
}
