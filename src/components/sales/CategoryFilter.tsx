import React from 'react';
import { Category } from '../../store/services/categoryService';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategorySelect('all')}
        className={`px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 ${
          selectedCategory === 'all'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories?.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategorySelect(category._id)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 ${
            selectedCategory === category._id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;