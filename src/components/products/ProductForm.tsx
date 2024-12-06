import React from "react";
import { useForm } from "react-hook-form";
import ModifierForm from "./ModifierForm";
import { Category } from "../../store/services/categoryService";

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  modifiers: any[];
  onModifierChange: (index: number, field: string, value: string) => void;
  onModifierOptionChange: (
    modifierIndex: number,
    optionIndex: number,
    field: string,
    value: string | number
  ) => void;
  onAddModifier: () => void;
  onAddModifierOption: (modifierIndex: number) => void;
  onRemoveModifier: (modifierIndex: number) => void;
  onRemoveModifierOption: (modifierIndex: number, optionIndex: number) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  initialData,
  onSubmit,
  onCancel,
  modifiers,
  onModifierChange,
  onModifierOptionChange,
  onAddModifier,
  onAddModifierOption,
  onRemoveModifier,
  onRemoveModifierOption,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      category: initialData?.category?._id || initialData?.category,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required", min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", { required: "Stock is required", min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          {...register("image")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <ModifierForm
        modifiers={modifiers}
        onModifierChange={onModifierChange}
        onModifierOptionChange={onModifierOptionChange}
        onAddModifier={onAddModifier}
        onAddModifierOption={onAddModifierOption}
        onRemoveModifier={onRemoveModifier}
        onRemoveModifierOption={onRemoveModifierOption}
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;