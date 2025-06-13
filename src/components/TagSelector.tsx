import React, { useState, useRef, useEffect, Fragment } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react';
import { TAG_COLORS } from '../types/TodoItem';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  allowCustomTags?: boolean;
  className?: string;
  showTagCloud?: boolean; // 是否顯示標籤雲
  compact?: boolean; // 緊湊顯示模式
  readOnly?: boolean; // 唯讀模式
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  allowCustomTags = true,
  className = '',
  showTagCloud = false,
  compact = false,
  readOnly = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 預設標籤選項
  const availableTags = Object.keys(TAG_COLORS);

  // 過濾已選擇的標籤
  const filteredTags = availableTags.filter(
    tag => !selectedTags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  // 處理點擊標籤
  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  // 處理移除標籤
  const handleRemoveTag = (tag: string) => {
    if (!readOnly) {
      onChange(selectedTags.filter(t => t !== tag));
    }
  };

  // 處理輸入框按鍵事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      // 檢查是否是預設標籤
      const existingTag = availableTags.find(tag => tag.toLowerCase() === inputValue.toLowerCase());

      if (existingTag) {
        // 如果是預設標籤，直接添加
        handleTagClick(existingTag);
      } else if (allowCustomTags) {
        // 如果允許自定義標籤，添加新標籤
        handleTagClick(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      // 當輸入框為空時，按 Backspace 刪除最後一個標籤
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'Escape') {
      // 按 Escape 關閉下拉選單
      setIsDropdownOpen(false);
    }
  };

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 獲取標籤的顏色類
  const getTagColorClass = (tag: string) => {
    // 檢查預設標籤中是否存在
    if (tag in TAG_COLORS) {
      return TAG_COLORS[tag];
    }
    // 為自訂標籤使用默認顏色
    return 'bg-gray-500';
  };

  // 緊湊模式僅顯示標籤，無編輯功能
  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <span
              key={tag}
              className={`${getTagColorClass(tag)} text-white text-xs px-1.5 py-0.5 rounded-full text-[0.7rem]`}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500">無標籤</span>
        )}
      </div>
    );
  }

  // 唯讀模式 - 只顯示已選標籤，不可編輯
  if (readOnly) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <span
              key={tag}
              className={`${getTagColorClass(tag)} text-white px-1.5 py-0.5 rounded-md text-xs`}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500">無標籤</span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Combobox multiple value={selectedTags} onChange={onChange}>
        <div className="flex flex-wrap items-center gap-1.5 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {selectedTags.map(tag => (
            <div
              key={tag}
              className={`${getTagColorClass(tag)} text-white px-1.5 py-0.5 rounded-md text-xs flex items-center`}
            >
              {tag}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
                className="ml-1 text-white hover:text-gray-200 focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
          <ComboboxInput
            className="flex-grow outline-none text-sm min-w-[120px]"
            placeholder={selectedTags.length === 0 ? '添加標籤...' : ''}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            displayValue={() => inputValue}
          />
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setInputValue('')}
          show={isDropdownOpen && filteredTags.length > 0}
        >
          <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredTags.map(tag => (
              <ComboboxOption
                key={tag}
                value={tag}
                className={`cursor-pointer select-none relative p-1 m-1 rounded
                  ${getTagColorClass(tag)} text-white hover:opacity-90 text-xs`}
              >
                {tag}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Transition>
      </Combobox>

      {/* 標籤雲 */}
      {showTagCloud && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm text-gray-600 font-medium">常用標籤</h4>
            <button
              type="button"
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showAllTags ? '顯示常用' : '顯示全部'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {(showAllTags ? availableTags : availableTags.slice(0, 10)).map(tag => (
              <div
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`${getTagColorClass(tag)} text-white px-1.5 py-0.5 rounded-md text-xs cursor-pointer transform transition-transform hover:scale-105`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
