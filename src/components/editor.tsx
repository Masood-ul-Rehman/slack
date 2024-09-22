import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { PiTextAa } from "react-icons/pi";
import { MdSend, MdCancel, MdCheck, MdOutlineCancel } from "react-icons/md";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";

type EditorSubmit = {
  image: File | null;
  body: string;
};
interface EditorProps {
  variant?: "create" | "edit";
  onSubmit?: (data: EditorSubmit) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: React.MutableRefObject<Quill | null>;
}
const Editor = ({
  variant = "create",
  onSubmit,
  onCancel,
  placeholder = "Write a message...",
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [toolBarVisible, setToolBarVisible] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const innerRefRef = useRef(innerRef);
  const quillRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
    innerRefRef.current = innerRef;
  });

  useEffect(() => {
    if (!editorRef.current) return;
    const container = editorRef.current;
    if (editorRef.current) {
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: placeholderRef.current,
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
          keyboard: {
            bindings: {
              "Shift+Enter": {
                key: 13,
                shiftKey: true,
                handler: () => {
                  quill.insertText(quill.getSelection()?.index || 0, "\n");
                },
              },
              enter: {
                key: "Enter",
                shiftKey: false,
                handler: () => {
                  const text = quill.getText();
                  const addedImage =
                    imageElementRef.current?.files?.[0] || null;
                  const isEmpty =
                    !addedImage &&
                    text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                  if (isEmpty) return;
                  const body = JSON.stringify(quill.getContents());
                  submitRef.current?.({ body, image: addedImage });
                  setImage(null);
                  if (imageElementRef.current) {
                    imageElementRef.current.value = "";
                  }
                },
              },
            },
          },
        },
      });
      quillRef.current = quill;
      quillRef.current.focus();
      if (innerRef) {
        innerRef.current = quill;
      }
      quill.setContents(defaultValueRef.current);
      setText(quill.getText());
      quill.on(Quill.events.TEXT_CHANGE, () => {
        setText(quill.getText());
      });
    }
    return () => {
      quillRef.current?.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRefRef.current) {
        innerRefRef.current.current = null;
      }
    };
  }, [innerRef]);

  const handleToolBarVisible = () => {
    setToolBarVisible(!toolBarVisible);
    const toolbarElement = editorRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };
  const handleEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    const index = quill?.getSelection()?.index || 0;
    quill?.insertText(index, emoji);
  };
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageElementRef}
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
        }}
      />
      <div className="flex flex-col border border-x-slate-200 rounde-md overflow-hidden ">
        <div ref={editorRef} className="h-full ql-custom bg-white" />
        {!!image && (
          <div className="relative size-[62px] mx-4 mb-2 flex items-center justify-center group/image ">
            <Hint label="Remove image">
              <button
                className="hidden group-hover/image:flex   bg-black/70 hover:bg-black absolute -top-2.5 -right-3 z-[10] rounded-full text-white size-6 border-2 border-white items-center justify-center  transition-all duration-300  "
                onClick={() => {
                  setImage(null);
                  if (imageElementRef.current) {
                    imageElementRef.current.value = "";
                  }
                }}
              >
                <XIcon className="size-3" />
              </button>
            </Hint>
            <Image
              src={URL.createObjectURL(image)}
              alt="image"
              fill
              className="rounded-xl overflow-hidden object-cover"
            />
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5] bg-white">
          <Hint label={toolBarVisible ? "Show formating" : "Hide formating"}>
            <Button
              disabled={disabled}
              size={"iconSm"}
              variant={"ghost"}
              onClick={handleToolBarVisible}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover hint="Add emoji" onEmojiSelect={handleEmojiSelect}>
            <Button disabled={false} size={"iconSm"} variant={"ghost"}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Add image">
              <Button
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
                onClick={() => {
                  if (imageElementRef.current) {
                    imageElementRef.current.click();
                  }
                }}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant == "edit" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant={"outline"} size={"sm"} onClick={onCancel}>
                <MdCancel className="size-4" />
              </Button>
              <Button
                disabled={disabled}
                size={"iconSm"}
                variant={"ghost"}
                onClick={() => {
                  onSubmit?.({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                className="bg-[#007A5A] hover:bg-[#007A5A]/80 text-white hover:text-white"
              >
                <MdCheck className="size-4" />
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint label="Send message">
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit?.({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                className={cn(
                  "ml-auto ",
                  isEmpty
                    ? "bg-white hover:bg-white/80 text-muted-foreground"
                    : "bg-[#007A5A] hover:bg-[#007A5A]/80 text-white"
                )}
                size={"iconSm"}
              >
                <MdSend className="size-4" />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {variant === "create" && (
        <div
          className={cn(
            "p-2 text-[12px] text-muted-foreground flex justify-end opacity-0",
            !isEmpty && "opacity-100"
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
