"use client";

import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useState } from "react";
import { useQuery } from "convex/react";

import { cn } from "@/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { Item } from "./item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {

  const params = useParams();
  const router = useRouter();

  // 通过expanded对象来 管理需要渲染或不渲染的父doc及其子doc
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /**
   * @desc 更改expanded对象中对应document的状态，渲染或移除对应递归的子级
   * @param documentId 当前递归轮次中的document id
   */
  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }))
  };

  let documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  })

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };


  console.log(documents);


  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      {/* Not Exist Page */}
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 25}px` : undefined
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>

      {/* Exist Page */}
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />

          {/* 递归DocumentList组件 */}
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              // 层级 + 1
              level={level + 1}
            />
          )}

        </div>
      ))}
    </>
  )
}