import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">待辦事項管理系統</h1>
        <p className="text-xl text-gray-600">最簡單有效的任務管理工具</p>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          登入
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          不登入直接使用
        </Link>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">功能特點</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li className="text-gray-700">使用 Google 帳號登入，同步您的待辦事項</li>
          <li className="text-gray-700">創建、編輯、刪除和標記待辦事項</li>
          <li className="text-gray-700">設置待辦事項優先級（低、中、高）</li>
          <li className="text-gray-700">過濾顯示所有、未完成或已完成的待辦事項</li>
          <li className="text-gray-700">按優先級或字母順序排序待辦事項</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
