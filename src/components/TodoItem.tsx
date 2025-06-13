import React, { useState } from 'react';
import type { TodoItemType } from '../types/TodoItem';

interface TodoItemProps {
  todo: TodoItemType;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  updatePriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  updatePriority,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleUpdate = () => {
    if (editText.trim() !== '') {
      updateTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  // 設定優先級邊框顏色
  const priorityBorder = {
    low: 'border-l-4 border-green-500',
    medium: 'border-l-4 border-yellow-500',
    high: 'border-l-4 border-red-500',
  }[todo.priority || 'low'];

  return (
    <div
      className={`flex items-center p-3 mb-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow ${priorityBorder}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        className="w-5 h-5 mr-3 cursor-pointer"
      />

      {isEditing ? (
        <div className="flex flex-grow mr-2">
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow px-2 py-1 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            className="px-3 py-1 mr-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            onClick={handleUpdate}
          >
            儲存
          </button>
          <button
            className="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => setIsEditing(false)}
          >
            取消
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-grow mr-3 break-words ${todo.completed ? 'line-through text-gray-500' : ''}`}
          >
            {todo.text}
          </span>
          <div className="flex items-center">
            <select
              value={todo.priority || 'low'}
              onChange={e => updatePriority(todo.id, e.target.value as 'low' | 'medium' | 'high')}
              className="px-2 py-1 mr-2 text-sm border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <button
              className="px-3 py-1 mr-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
              onClick={handleEdit}
            >
              編輯
            </button>
            <button
              className="px-3 py-1 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              onClick={() => deleteTodo(todo.id)}
            >
              刪除
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
