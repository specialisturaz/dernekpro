"use client";

import { useParams } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";

export default function EditNewsPage() {
  const params = useParams();
  return (
    <PostEditor
      postId={params.id as string}
      postType="NEWS"
      backUrl="/admin/icerik/haberler"
      typeLabelTr="Haber"
    />
  );
}
