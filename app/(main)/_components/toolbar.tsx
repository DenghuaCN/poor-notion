"use client";

import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import ReactTextareaAutosize from "react-textarea-autosize";


import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {

  console.log('initialData', initialData);


  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus();
    }, 0);
  }

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || 'Untitled' // 如果尝试删除标题则恢复默认标题名称
    });
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  }

  /**
   * @desc 更新icon
   */
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    })
  }

  /**
   * @desc 移除icon
   */
  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    })
  }

  return (
    <div className="pl-[54px] group relative">

      {/* 存在icon 且 为编辑状态 */}
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
          11111
        </div>
      )}

      {/* 存在icon 且 为预览状态 */}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">
          {initialData.icon}
          2222
        </p>
      )}

      {/* 添加icon与cover按钮区 */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {/* Add icon按钮，只在缺少icon 且 为编辑状态下才显示 */}
        {!initialData.icon && !preview && (
          <IconPicker
            asChild
            onChange={onIconSelect}
          >
            <Button size="sm" variant="outline" className="text-muted-foreground text-sm">
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {/* Add cover按钮，只在缺少封面 且 为编辑状态下才显示 */}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={() => { }}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {/* 点击标题，切换预览状态 与 编辑状态 */}
      {isEditing && !preview ? (
        <ReactTextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}