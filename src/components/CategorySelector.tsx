import React, { useState, Fragment } from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from '@headlessui/react';
import { DEFAULT_CATEGORIES } from '../types/TodoItem';

interface CategorySelectorProps {
  selectedCategory: string;
  onChange: (category: string) => void;
  categories?: string[];
  allowCustom?: boolean;
  className?: string;
  compact?: boolean; // 新增緊湊模式選項
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onChange,
  categories = DEFAULT_CATEGORIES,
  allowCustom = true,
  className = '',
  compact = false,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // 分類圖標映射 (使用 emoji 作為圖標)
  const categoryIcons: Record<string, string> = {
    全部: '📋',
    工作: '💼',
    個人: '👤',
    學習: '📚',
    健康: '🏃',
    購物: '🛒',
    其他: '📌',
  };

  const handleAddCustom = () => {
    if (customCategory.trim()) {
      onChange(customCategory.trim());
      setCustomCategory('');
      setIsAddingCustom(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    } else if (e.key === 'Escape') {
      setIsAddingCustom(false);
      setCustomCategory('');
    }
  };

  // 獲取當前分類的圖標
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📌';
  };

  if (compact) {
    // 緊湊模式 (用於 TodoItem 中)
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="mr-1">{getCategoryIcon(selectedCategory)}</span>
        <span className="text-sm font-medium">{selectedCategory}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Listbox value={selectedCategory} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center">
              <span className="mr-2">{getCategoryIcon(selectedCategory)}</span>
              <span>{selectedCategory}</span>
            </div>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
              {categories.map(category => (
                <ListboxOption
                  key={category}
                  value={category}
                  className={({ active, selected }) => `
                    ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    ${selected ? 'bg-blue-50 text-blue-700' : ''}
                    cursor-pointer select-none relative py-2 px-4 flex items-center
                  `}
                >
                  {({ selected }) => (
                    <>
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        {category}
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}

              {allowCustom && (
                <div className="px-4 py-2 border-t border-gray-100">
                  {!isAddingCustom ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(true)}
                      className="flex items-center w-full text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="mr-2">➕</span>
                      <span>添加自定義分類</span>
                    </button>
                  ) : (
                    <div className="flex">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        placeholder="輸入分類名稱..."
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustom}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                      >
                        添加
                      </button>
                    </div>
                  )}
                </div>
              )}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CategorySelector;
