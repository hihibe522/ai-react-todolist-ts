import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContextProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <Routes>
          {/* 公開路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 受保護路由 - 不需要登入 */}
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* 重定向錯誤路徑 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
