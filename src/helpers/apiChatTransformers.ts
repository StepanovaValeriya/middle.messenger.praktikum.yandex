import { ChatDTO } from "api/types";

export const apiChatTransformers = (data: ChatDTO): ChatType => {
  return {
    id: data.id,
    title: data.title,
    avatar: data.avatar,
    createdBy: data.created_by,
    unreadCount: data.unread_count,
    lastMessage: data.last_message,
  };
};
