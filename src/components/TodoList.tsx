import React, { useState, useEffect, useContext } from 'react';
import TodoItem from './TodoItem';
import type { TodoItemType } from '../types/TodoItem';
import { UserContext } from '../contexts/UserContext';
import {
  getTodos,
  addTodo as addTodoToFirestore,
  deleteCompletedTodos,
  toggleTodoComplete,
  updateTodo as updateTodoInFirestore,
  updateTodoPriority,
  updateTodoTags,
  updateTodoCategory,
  deleteTodo as deleteTodoFromFirestore,
} from '../services/TodoService';
import TagSelector from './TagSelector';
import CategorySelector from './CategorySelector';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'default' | 'priority' | 'alphabetical'>('default');

  // 新增待辦事項的狀態
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoTags, setNewTodoTags] = useState<string[]>([]);
  const [newTodoCategory, setNewTodoCategory] = useState<string>('全部');

  // 過濾用的狀態
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('全部');

  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  // 從 Firestore 載入待辦事項
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        if (user) {
          const fetchedTodos = await getTodos(user.id);
          setTodos(fetchedTodos);
        } else {
          // 未登入時使用一個特定的鍵來保存待辦事項
          const anonymousKey = 'anonymous_todos';
          const savedTodos = localStorage.getItem(anonymousKey);
          if (savedTodos) {
            try {
              setTodos(JSON.parse(savedTodos));
            } catch (e) {
              console.error('無法解析待辦事項', e);
              setTodos([]);
            }
          } else {
            setTodos([]);
          }
        }
      } catch (error) {
        console.error('載入待辦事項時發生錯誤', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [user]);

  // 未登入時，儲存待辦事項到 localStorage
  useEffect(() => {
    if (!user && todos.length >= 0) {
      // 使用一個特定的鍵來保存匿名用戶的待辦事項
      const anonymousKey = 'anonymous_todos';
      localStorage.setItem(anonymousKey, JSON.stringify(todos));
    }
  }, [todos, user]);

  // 新增待辦事項
  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const newTodo: Omit<TodoItemType, 'id'> = {
          text: inputValue,
          completed: false,
          createdAt: new Date(),
          priority: newTodoPriority,
          userId: user?.id || null,
          tags: newTodoTags,
          category: newTodoCategory === '全部' ? '其他' : newTodoCategory,
        };

        if (user) {
          // 登入狀態：添加到 Firestore
          const addedTodo = await addTodoToFirestore(newTodo);
          setTodos([addedTodo, ...todos]);
        } else {
          // 未登入狀態：添加到本地
          const localTodo: TodoItemType = {
            ...newTodo,
            id: Date.now().toString(), // 使用時間戳作為 ID
          };
          setTodos([localTodo, ...todos]);
        }

        setInputValue('');
      } catch (error) {
        console.error('添加待辦事項時發生錯誤', error);
      }
    }
  };

  // 切換待辦事項完成狀態
  const toggleComplete = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const newCompleted = !todoToUpdate.completed;

      if (user) {
        // 登入狀態：更新 Firestore
        await toggleTodoComplete(id, newCompleted);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: newCompleted } : todo)));
    } catch (error) {
      console.error('更新待辦事項狀態時發生錯誤', error);
    }
  };

  // 刪除待辦事項
  const deleteTodo = async (id: string) => {
    try {
      if (user) {
        // 登入狀態：從 Firestore 刪除
        await deleteTodoFromFirestore(id);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('刪除待辦事項時發生錯誤', error);
    }
  };

  // 更新待辦事項文字
  const updateTodo = async (id: string, text: string) => {
    try {
      if (user) {
        // 登入狀態：更新 Firestore
        await updateTodoInFirestore(id, { text });
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, text } : todo)));
    } catch (error) {
      console.error('更新待辦事項時發生錯誤', error);
    }
  };

  // 更新待辦事項優先級
  const updatePriority = async (id: string, priority: 'low' | 'medium' | 'high') => {
    try {
      if (user) {
        // 登入狀態：更新 Firestore
        await updateTodoPriority(id, priority);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, priority } : todo)));
    } catch (error) {
      console.error('更新待辦事項優先級時發生錯誤', error);
    }
  };

  // 更新待辦事項標籤
  const updateTags = async (id: string, tags: string[]) => {
    try {
      if (user) {
        // 登入狀態：更新 Firestore
        await updateTodoTags(id, tags);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, tags } : todo)));
    } catch (error) {
      console.error('更新待辦事項標籤時發生錯誤', error);
    }
  };

  // 更新待辦事項分類
  const updateCategory = async (id: string, category: string) => {
    try {
      if (user) {
        // 登入狀態：更新 Firestore
        await updateTodoCategory(id, category);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, category } : todo)));
    } catch (error) {
      console.error('更新待辦事項分類時發生錯誤', error);
    }
  };

  // 清除所有已完成的待辦事項
  const clearCompleted = async () => {
    try {
      if (user) {
        // 登入狀態：從 Firestore 刪除已完成項目
        await deleteCompletedTodos(user.id);
      }

      // 無論是否登入，都更新本地狀態
      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      console.error('清除已完成待辦事項時發生錯誤', error);
    }
  };

  // 處理鍵盤事件 (按 Enter 新增待辦事項)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // 過濾與排序待辦事項
  const filteredAndSortedTodos = () => {
    // 先過濾
    let result = todos;

    // 基本過濾（完成狀態）
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // 根據分類過濾
    if (filterCategory !== '全部') {
      result = result.filter(todo => todo.category === filterCategory);
    }

    // 根據標籤過濾
    if (filterTags.length > 0) {
      result = result.filter(todo => todo.tags && filterTags.some(tag => todo.tags.includes(tag)));
    }

    // 再排序
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return [...result].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (sort === 'alphabetical') {
      return [...result].sort((a, b) => a.text.localeCompare(b.text));
    }

    return result;
  };

  // 計算出過濾後的待辦事項列表
  const displayedTodos = filteredAndSortedTodos();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">待辦事項清單</h1>{' '}
      <div className="mb-6">
        {/* 新增待辦事項輸入區域 */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">新增待辦事項</h3>
          <div className="flex items-center mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="輸入待辦事項..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={addTodo}
            >
              新增
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600">優先級</label>
              <select
                value={newTodoPriority}
                onChange={e => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">低優先</option>
                <option value="medium">中優先</option>
                <option value="high">高優先</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600">分類</label>
              <CategorySelector
                selectedCategory={newTodoCategory}
                onChange={setNewTodoCategory}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600">標籤</label>
              <TagSelector
                selectedTags={newTodoTags}
                onChange={setNewTodoTags}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 過濾與排序區域 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <h3 className="text-md font-medium text-gray-800 mr-2 whitespace-nowrap">過濾：</h3>
              <div className="flex flex-wrap gap-1">
                <button
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  全部
                </button>
                <button
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('active')}
                >
                  未完成
                </button>
                <button
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === 'completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setFilter('completed')}
                >
                  已完成
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="mr-2 text-sm text-gray-600">排序方式：</label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as 'default' | 'priority' | 'alphabetical')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">預設</option>
                <option value="priority">優先級</option>
                <option value="alphabetical">字母順序</option>
              </select>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">分類篩選</h3>
              <div className="text-xs text-gray-500">
                {filterCategory === '全部' ? '顯示全部分類' : `僅顯示：${filterCategory}`}
              </div>
            </div>
            <CategorySelector
              selectedCategory={filterCategory}
              onChange={setFilterCategory}
              className="w-full"
            />
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">標籤篩選</h3>
              <div className="text-xs text-gray-500">
                {filterTags.length === 0 ? '顯示全部標籤' : `已選擇 ${filterTags.length} 個標籤`}
              </div>
            </div>
            <TagSelector
              selectedTags={filterTags}
              onChange={setFilterTags}
              className="w-full"
              showTagCloud={true}
            />
          </div>
        </div>
      </div>
      {/* 待辦事項列表 */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-4 text-gray-500">載入中...</div>
        ) : displayedTodos.length > 0 ? (
          displayedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              updatePriority={updatePriority}
              updateTags={updateTags}
              updateCategory={updateCategory}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            {filter === 'all'
              ? '目前沒有待辦事項'
              : filter === 'active'
                ? '沒有未完成的待辦事項'
                : '沒有已完成的待辦事項'}
          </div>
        )}
      </div>
      {/* 底部按鈕區 */}
      <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          {displayedTodos.filter(todo => !todo.completed).length} 個未完成
        </span>
        <button
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={clearCompleted}
          disabled={!todos.some(todo => todo.completed)}
        >
          清除已完成
        </button>
      </div>
    </div>
  );
};

export default TodoList;
