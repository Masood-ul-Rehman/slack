import { useParentMessageId } from "../store/use-parent-message-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  console.log(parentMessageId, "parentMessageId");
  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
  };
  const onCloseMessage = () => {
    setParentMessageId(null);
  };
  return {
    parentMessageId,
    onOpenMessage,
    onCloseMessage,
  };
};
