import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import Quill from "quill";
import { Id } from "@/convex/_generated/dataModel";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

import { useCreateMessage } from "@/features/workspaces/api/messages/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

const ChatInput = ({
  placeholder,
  variant,
  parentMessageId,
  conversationId,
  receiverId,
}: {
  placeholder?: string;
  variant: "create" | "edit";
  parentMessageId?: Id<"messages"> | null;
  conversationId?: Id<"conversations"> | null;
  receiverId?: Id<"members"> | null;
}) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);
  const { mutate } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const editorRef = useRef<Quill | null>(null);
  const { id: workspaceId, channelId } = useParams<{
    id: string;
    channelId: string;
  }>();
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    setPending(true);
    editorRef.current?.enable(false);
    if (!conversationId && !parentMessageId && !channelId) {
      return toast.error("Please select a channel or conversation");
    }
    const sendMessage = (storageLink: string) =>
      mutate(
        {
          workspaceId,
          channelId,
          body,
          image: storageLink,
          parentMessageId: parentMessageId ?? undefined,
          conversationId: conversationId ?? undefined,
          receiverId: receiverId ?? undefined,
        },
        {
          onError(error) {
            toast.error(error.message || "Error sending message");
          },
          onSuccess() {
            setPending(false);
            setEditorKey((prev) => prev + 1);
            editorRef.current?.enable(true);
          },
        }
      );
    if (image) {
      generateUploadUrl(
        {},
        {
          onError(error) {
            toast.error(error.message || "Error generating upload url");
            setPending(false);
            editorRef.current?.enable(true);
          },
          onSuccess: async (data) => {
            let urlString = data as string | undefined;
            if (!urlString) return toast.error("Error generating upload url");
            const result = await fetch(urlString, {
              method: "POST",
              headers: { "Content-Type": image!.type },
              body: image,
            });
            if (result.ok) {
              const { storageId } = await result.json();
              if (storageId) {
                sendMessage(storageId);
              }
            }
          },
        }
      );
    } else {
      sendMessage("");
    }
  };
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant={variant}
        placeholder={placeholder || "Type your message here..."}
        onSubmit={handleSubmit}
        disabled={pending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
