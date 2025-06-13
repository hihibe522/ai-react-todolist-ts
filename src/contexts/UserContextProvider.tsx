import { useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { User } from '../types/User';
import { UserContext } from './UserContext';

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // 在組件掛載時監聽 Firebase 身份驗證狀態
  useEffect(() => {
    // 監聽 Firebase 認證狀態變化
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        // 用戶已登入
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || 'no-email',
          picture: firebaseUser.photoURL || '',
          isLoggedIn: true,
        };

        // 清除匿名用戶數據
        localStorage.removeItem('anonymous_todos');

        // 將用戶信息存儲在 localStorage 中
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        // 用戶未登入
        localStorage.removeItem('user');
        setUser(null);
      }
    });

    // 清理函數
    return () => unsubscribe();
  }, []);

  // 登出函數
  const logout = async () => {
    try {
      await signOut(auth);
      // Firebase 的 onAuthStateChanged 會處理後續的狀態更新
    } catch (error) {
      console.error('登出時發生錯誤', error);
    }
  };

  const value = {
    user,
    setUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
