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
  deleteTodo as deleteTodoFromFirestore,
} from '../services/TodoService';
import './TodoList.css';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'default' | 'priority' | 'alphabetical'>('default');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
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
          // 未登入時仍然可以使用本地儲存
          const savedTodos = localStorage.getItem('todos');
          if (savedTodos) {
            try {
              setTodos(JSON.parse(savedTodos));
            } catch (e) {
              console.error('無法解析待辦事項', e);
              setTodos([]);
            }
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
    if (!user && todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
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
          priority: selectedPriority,
          userId: user?.id || null,
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
    if (filter === 'active') {
      result = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = todos.filter(todo => todo.completed);
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
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">待辦事項清單</h1>

      <div className="flex items-center mb-6">
        <div className="flex items-center mr-3">
          <label className="mr-2 text-sm text-gray-600">優先級：</label>
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="新增待辦事項..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={addTodo}
        >
          新增
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-3 py-1 rounded-md mr-2 transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`px-3 py-1 rounded-md mr-2 transition-colors ${
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

        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-600">排序：</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'default' | 'priority' | 'alphabetical')}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">預設</option>
            <option value="priority">優先級</option>
            <option value="alphabetical">字母順序</option>
          </select>
        </div>
      </div>

      <div className="mb-4 max-h-96 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : displayedTodos.length === 0 ? (
          <p className="text-center text-gray-500 py-6 bg-gray-50 rounded-md">
            目前沒有
            {filter === 'all' ? '' : filter === 'active' ? '未完成的' : '已完成的'}
            待辦事項
          </p>
        ) : (
          displayedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              updatePriority={updatePriority}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex gap-4 text-sm text-gray-600">
            <p>總計: {todos.length} 項</p>
            <p>已完成: {todos.filter(todo => todo.completed).length} 項</p>
            <p>未完成: {todos.filter(todo => !todo.completed).length} 項</p>
          </div>

          {todos.some(todo => todo.completed) && (
            <button
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              onClick={clearCompleted}
            >
              清除已完成項目
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
