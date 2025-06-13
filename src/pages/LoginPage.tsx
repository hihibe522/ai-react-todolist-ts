import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login';
import { UserContext } from '../contexts/UserContext';

const LoginPage: React.FC = () => {
  const { user } = useContext(UserContext);

  // 如果用戶已登入，跳轉到儀表板
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">登入帳戶</h1>
        <p className="text-gray-600">使用您的 Google 帳號繼續</p>
      </div>

      <Login />
    </div>
  );
};

export default LoginPage;
