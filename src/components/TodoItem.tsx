import React, { useState } from 'react';
import type { TodoItemType } from '../types/TodoItem';
import TagSelector from './TagSelector';
import CategorySelector from './CategorySelector';

interface TodoItemProps {
  todo: TodoItemType;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  updatePriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
  updateTags: (id: string, tags: string[]) => void;
  updateCategory: (id: string, category: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleComplete,
  deleteTodo,
  updateTodo,
  updatePriority,
  updateTags,
  updateCategory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

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

  // 處理標籤變更
  const handleTagsChange = (newTags: string[]) => {
    updateTags(todo.id, newTags);
    setIsEditingTags(false);
  };

  // 處理分類變更
  const handleCategoryChange = (newCategory: string) => {
    updateCategory(todo.id, newCategory);
    setIsEditingCategory(false);
  };

  // 切換詳細資訊顯示
  const toggleDetails = () => {
    setIsShowingDetails(!isShowingDetails);
  };

  return (
    <div className="mb-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      {/* 主要內容 */}
      <div className={`flex items-center p-3 ${priorityBorder}`}>
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
            <div className="flex-grow mr-3">
              <span className={`break-words ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>

              <div className="flex items-center mt-1 space-x-2">
                {/* 分類顯示 - 使用圖標 */}
                {todo.category && todo.category !== '其他' && (
                  <CategorySelector
                    selectedCategory={todo.category}
                    onChange={() => {}}
                    compact={true}
                  />
                )}

                {/* 標籤顯示 - 使用緊湊模式 */}
                {todo.tags && todo.tags.length > 0 && (
                  <TagSelector selectedTags={todo.tags} onChange={() => {}} compact={true} />
                )}
              </div>
            </div>

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
                className="px-3 py-1 mr-2 text-sm text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                onClick={handleEdit}
              >
                編輯
              </button>
              <button
                className="px-3 py-1 mr-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                onClick={toggleDetails}
              >
                {isShowingDetails ? '隱藏' : '詳情'}
              </button>
              <button
                className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                onClick={() => deleteTodo(todo.id)}
              >
                刪除
              </button>
            </div>
          </>
        )}
      </div>

      {/* 詳細資訊區塊 */}
      {isShowingDetails && !isEditing && (
        <div className="p-3 pt-0 border-t border-gray-100">
          {/* 標籤編輯區塊 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">標籤</span>
              <button
                className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setIsEditingTags(!isEditingTags)}
              >
                {isEditingTags ? '取消' : '編輯標籤'}
              </button>
            </div>

            {isEditingTags ? (
              <TagSelector
                selectedTags={todo.tags || []}
                onChange={handleTagsChange}
                showTagCloud={true}
              />
            ) : (
              <TagSelector selectedTags={todo.tags || []} onChange={() => {}} readOnly={true} />
            )}
          </div>

          {/* 分類編輯區塊 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">分類</span>
              <button
                className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                onClick={() => setIsEditingCategory(!isEditingCategory)}
              >
                {isEditingCategory ? '取消' : '編輯分類'}
              </button>
            </div>

            {isEditingCategory ? (
              <CategorySelector
                selectedCategory={todo.category || '其他'}
                onChange={handleCategoryChange}
              />
            ) : (
              <div className="flex items-center">
                <CategorySelector
                  selectedCategory={todo.category || '其他'}
                  onChange={() => {}}
                  compact={true}
                />
                <span className="ml-2 text-sm text-gray-700">{todo.category || '其他'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
