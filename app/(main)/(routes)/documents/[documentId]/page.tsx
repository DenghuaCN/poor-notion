"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { Toolbar } from "@/app/(main)/_components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "@/components/cover";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  });

  if (document === undefined) {
    return (
      <div>Loading... (placeholder)</div>
    )
  }
  if (document === null) {
    return (
      <div>Not Found</div>
    )
  }

  return (
    <div className="pb-40">

      <Cover
        url={document.coverImage}
      />

      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentIdPage;