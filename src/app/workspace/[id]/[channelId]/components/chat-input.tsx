import React, { useRef } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder }: { placeholder: string }) => {
  const editorRef = useRef<Quill | null>(null);
  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log(body, image);
  };
  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        placeholder="Type your message here..."
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
