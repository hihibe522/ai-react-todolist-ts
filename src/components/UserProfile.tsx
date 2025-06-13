import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex items-center">
        {user.picture && (
          <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
      >
        登出
      </button>
    </div>
  );
};

export default UserProfile;
