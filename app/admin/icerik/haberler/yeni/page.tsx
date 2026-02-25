import PostEditor from "@/components/admin/PostEditor";

export default function NewNewsPage() {
  return (
    <PostEditor
      postType="NEWS"
      backUrl="/admin/icerik/haberler"
      typeLabelTr="Haber"
    />
  );
}
