import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetCategoriesQuery } from '../store/services/categoryService';
import { 
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../store/services/productService';
import ProductForm from '../components/products/ProductForm';

const Products = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: products, isLoading } = useGetProductsQuery(storeId!);
  const { data: categories } = useGetCategoriesQuery(storeId!);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [modifiers, setModifiers] = useState<any[]>([]);

  const resetForm = () => {
    setEditingProduct(null);
    setModifiers([]);
    setIsModalOpen(false);
  };

  const handleAddModifier = () => {
    setModifiers([...modifiers, { name: '', options: [{ name: '', price: 0 }] }]);
  };

  const handleAddModifierOption = (modifierIndex: number) => {
    const newModifiers = [...modifiers];
    newModifiers[modifierIndex] = {
      ...newModifiers[modifierIndex],
      options: [...newModifiers[modifierIndex].options, { name: '', price: 0 }]
    };
    setModifiers(newModifiers);
  };

  const handleModifierChange = (index: number, field: string, value: string) => {
    const newModifiers = [...modifiers];
    newModifiers[index] = { ...newModifiers[index], [field]: value };
    setModifiers(newModifiers);
  };

  const handleModifierOptionChange = (
    modifierIndex: number,
    optionIndex: number,
    field: string,
    value: string | number
  ) => {
    const newModifiers = [...modifiers];
    const newOptions = [...newModifiers[modifierIndex].options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      [field]: field === 'price' ? Number(value) : value,
    };
    newModifiers[modifierIndex] = {
      ...newModifiers[modifierIndex],
      options: newOptions,
    };
    setModifiers(newModifiers);
  };

  const handleRemoveModifier = (modifierIndex: number) => {
    setModifiers(modifiers.filter((_, index) => index !== modifierIndex));
  };

  const handleRemoveModifierOption = (modifierIndex: number, optionIndex: number) => {
    const newModifiers = [...modifiers];
    newModifiers[modifierIndex] = {
      ...newModifiers[modifierIndex],
      options: newModifiers[modifierIndex].options.filter(
        (_: any, index: number) => index !== optionIndex
      ),
    };
    setModifiers(newModifiers);
  };

  const onSubmit = async (data: any) => {
    try {
      const productData = {
        ...data,
        store: storeId,
        modifiers: modifiers.map(modifier => ({
          ...modifier,
          options: modifier.options.map((option: any) => ({
            ...option,
            price: Number(option.price)
          }))
        })),
        price: Number(data.price),
        stock: Number(data.stock)
      };

      if (editingProduct) {
        await updateProduct({ _id: editingProduct._id, ...productData }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Products
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setModifiers(product.modifiers || []);
                    setIsModalOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <ProductForm
              categories={categories || []}
              initialData={editingProduct}
              onSubmit={onSubmit}
              onCancel={resetForm}
              modifiers={modifiers}
              onModifierChange={handleModifierChange}
              onModifierOptionChange={handleModifierOptionChange}
              onAddModifier={handleAddModifier}
              onAddModifierOption={handleAddModifierOption}
              onRemoveModifier={handleRemoveModifier}
              onRemoveModifierOption={handleRemoveModifierOption}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;