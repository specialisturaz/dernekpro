"use client";

import { useParams } from "next/navigation";
import BranchEditor from "@/components/admin/BranchEditor";

export default function SubeDuzenlePage() {
  const { id } = useParams() as { id: string };
  return <BranchEditor mode="edit" branchId={id} />;
}
