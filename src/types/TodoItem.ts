export interface TodoItemType {
  id: string; // 使用 string 類型的 ID 來兼容 Firestore 文檔 ID
  text: string;
  completed: boolean;
  createdAt: Date; // 創建時間
  priority: 'low' | 'medium' | 'high'; // 優先級
  userId: string | null; // 用戶 ID
}
