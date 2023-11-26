"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { edgestore } = useEdgeStore();
  const coverImageStore = useCoverImage();
  const update = useMutation(api.documents.update);

  /**
   * @desc 上传图片
   */
  const onChange = async (file?: File) => {
    if (!file) return;

    setIsSubmit(true);
    setFile(file);

    const res = await edgestore.publicFiles.upload({
      file,
      options: {
        replaceTargetUrl: coverImageStore.replaceUrl //如果存在旧的图片，将替换原有图片
      }
    })

    // 更新图片URL
    await update({
      id: params.documentId as Id<"documents">,
      coverImage: res.url
    })

    onClose();
  }

  /**
   * @desc 关闭上传图片dialog
   */
  const onClose = () => {
    setFile(undefined);
    setIsSubmit(false);
    coverImageStore.onClose();
  }

  return (
    <Dialog open={coverImageStore.isOpen} onOpenChange={coverImageStore.onClose} >
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Cover Image
          </h2>
        </DialogHeader>

        {/* 上传图片组件 */}
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmit}
          value={file}
          onChange={onChange} // 触发上传event handle
        />

      </DialogContent>
    </Dialog>
  );
};