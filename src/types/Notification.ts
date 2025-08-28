export interface Notification {
  id: string;
  type: "reminder" | "success" | "warning" | "error";
  title: string;
  message: string;
  documentId?: string;
  isRead: boolean;
  createdAt: Date;
}
