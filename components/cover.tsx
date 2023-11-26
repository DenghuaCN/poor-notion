"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { RemoveCoverImageModal } from "./modals/remove-cover-modal";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";


interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();

  const params = useParams();

  const coverImageStore = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (!url) return;

    // 永久删除图片，节省桶存储空间
    await edgestore.publicFiles.delete({
      url,
    })

    removeCoverImage({
      id: params.documentId as Id<"documents">
    })
  };

  return (
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>

      {!!url && (
        <Image
          src={url}
          fill
          alt="Cover"
          className="object-cover"
        />
      )}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          {/* Change Cover */}
          <Button
            // 点击替换时，对useCoverImage store写入旧的图片url，以供替换
            onClick={() => coverImageStore.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>

          {/* Remove Cover */}
          <RemoveCoverImageModal onConfirm={onRemove}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </RemoveCoverImageModal>

        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className="w-full h-[12vh]" />
  )
}