import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

interface ProtectedRouteProps {
  requireAuth?: boolean; // 是否要求用戶登入
}

// 保護路由組件
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth = true }) => {
  const { user } = useContext(UserContext);

  // 如果要求登入但用戶未登入，重定向到登入頁
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // 渲染子路由
  return <Outlet />;
};

export default ProtectedRoute;
