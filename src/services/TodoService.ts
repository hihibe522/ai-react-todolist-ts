import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { TodoItemType } from '../types/TodoItem';

// Firestore 集合名稱
const TODOS_COLLECTION = 'todos';

// 將 Firestore 文檔轉換為 TodoItemType
const convertToTodoItem = (doc: QueryDocumentSnapshot<DocumentData>): TodoItemType => {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text || '',
    completed: data.completed || false,
    createdAt: data.createdAt?.toDate() || new Date(),
    priority: data.priority || 'medium',
    userId: data.userId || null,
  };
};

// 獲取用戶的所有待辦事項
export const getTodos = async (userId: string | undefined): Promise<TodoItemType[]> => {
  try {
    // 如果沒有用戶 ID，返回空數組
    if (!userId) return [];

    // 創建查詢
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // 執行查詢
    const querySnapshot = await getDocs(q);

    // 將查詢結果轉換為待辦事項數組
    return querySnapshot.docs.map(convertToTodoItem);
  } catch (error) {
    console.error('獲取待辦事項時發生錯誤', error);
    throw error;
  }
};

// 添加待辦事項
export const addTodo = async (todo: Omit<TodoItemType, 'id'>): Promise<TodoItemType> => {
  try {
    // 準備要添加的文檔
    const todoToAdd = {
      ...todo,
      createdAt: serverTimestamp(),
    };

    // 添加文檔
    const docRef = await addDoc(collection(db, TODOS_COLLECTION), todoToAdd);

    // 返回添加的待辦事項（包含 ID）
    return {
      id: docRef.id,
      ...todo,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('添加待辦事項時發生錯誤', error);
    throw error;
  }
};

// 更新待辦事項
export const updateTodo = async (todoId: string, updates: Partial<TodoItemType>): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, updates);
  } catch (error) {
    console.error('更新待辦事項時發生錯誤', error);
    throw error;
  }
};

// 刪除待辦事項
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error('刪除待辦事項時發生錯誤', error);
    throw error;
  }
};

// 更新待辦事項完成狀態
export const toggleTodoComplete = async (todoId: string, completed: boolean): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, { completed });
  } catch (error) {
    console.error('更新待辦事項完成狀態時發生錯誤', error);
    throw error;
  }
};

// 更新待辦事項優先級
export const updateTodoPriority = async (
  todoId: string,
  priority: 'low' | 'medium' | 'high'
): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, { priority });
  } catch (error) {
    console.error('更新待辦事項優先級時發生錯誤', error);
    throw error;
  }
};

// 批量刪除已完成的待辦事項
export const deleteCompletedTodos = async (userId: string): Promise<void> => {
  try {
    // 查詢用戶的已完成待辦事項
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('userId', '==', userId),
      where('completed', '==', true)
    );

    const querySnapshot = await getDocs(q);

    // 刪除每個已完成的待辦事項
    const promises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(promises);
  } catch (error) {
    console.error('刪除已完成待辦事項時發生錯誤', error);
    throw error;
  }
};
