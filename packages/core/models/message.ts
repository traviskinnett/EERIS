export interface Message{
    id: number;
    subject: string;
    content: string;
    datetime: Date;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    status: "Read" | "Unread";
    // type: NotificationType;
}

// export type NotificationType = "Error" | "Warning" | "Direct Message" | "Success"