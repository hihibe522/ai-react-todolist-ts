import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import UserProfile from '../components/UserProfile';
import { UserContext } from '../contexts/UserContext';

const DashboardPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // 檢查用戶是否登入（可選，因為我們有 ProtectedRoute 組件）
  useEffect(() => {
    // 如果需要強制登入才能訪問儀表板，可以取消下面的註釋
    // if (!user) {
    //   navigate('/login');
    // }
  }, [user, navigate]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {user ? '您的待辦事項' : '臨時待辦事項'}
        </h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          返回首頁
        </button>
      </div>

      {user ? (
        <UserProfile />
      ) : (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700">您正在使用臨時模式，待辦事項只會保存在當前瀏覽器中。</p>
          <p className="text-right">
            <button
              onClick={() => navigate('/login')}
              className="mr-2 bg-red-500 text-white  hover:underline"
            >
              登入
            </button>
            以同步到您的帳戶。
          </p>
        </div>
      )}

      <TodoList />
    </div>
  );
};

export default DashboardPage;
