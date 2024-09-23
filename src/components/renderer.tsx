import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { usePanel } from "@/features/workspaces/hooks/use-panel";

interface RendererProps {
  value: string;
  variant: "channel" | "thread" | "conversation";
}

const Renderer = ({ value, variant }: RendererProps) => {
  const { parentMessageId } = usePanel();
  const isPanelOpen = !!parentMessageId;
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;
    const container = rendererRef.current;
    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);

    const contents = JSON.parse(value);
    quill.setContents(contents);
    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;
  return (
    <div
      ref={rendererRef}
      className={`ql-editor ql-renderer w-full ${
        variant === "thread"
          ? "w-[20vw]"
          : variant === "conversation"
            ? "w-[400px]"
            : isPanelOpen
              ? "w-[calc(40vw-1rem)]"
              : "w-[calc(60vw-1rem)]"
      }`}
    />
  );
};

export default Renderer;
