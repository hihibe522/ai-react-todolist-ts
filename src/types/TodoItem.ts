export interface TodoItemType {
  id: string; // 使用 string 類型的 ID 來兼容 Firestore 文檔 ID
  text: string;
  completed: boolean;
  createdAt: Date; // 創建時間
  priority: 'low' | 'medium' | 'high'; // 優先級
  userId: string | null; // 用戶 ID
  tags: string[]; // 待辦事項的標籤列表
  category: string; // 待辦事項的分類 (例如: 工作, 個人, 學習等)
}

// 預設的分類選項
export const DEFAULT_CATEGORIES = ['全部', '工作', '個人', '學習', '健康', '購物', '其他'];

// 預設標籤顏色映射 (使用 Tailwind CSS 顏色)
export const TAG_COLORS: Record<string, string> = {
  重要: 'bg-red-500',
  緊急: 'bg-orange-500',
  進行中: 'bg-yellow-500',
  計劃: 'bg-blue-500',
  完成: 'bg-green-500',
  待定: 'bg-purple-500',
  文件: 'bg-gray-500',
  會議: 'bg-indigo-500',
  郵件: 'bg-pink-500',
  電話: 'bg-teal-500',
  研究: 'bg-cyan-500',
  閱讀: 'bg-amber-500',
};
