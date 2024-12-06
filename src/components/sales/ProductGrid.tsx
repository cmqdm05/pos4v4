import React from 'react';
import { Product } from '../../store/services/productService';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductGrid = ({ products, onProductSelect }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pb-4">
      {products?.map((product) => {
        const isOutOfStock = product.stock <= 0;
        
        return (
          <button
            key={product._id}
            onClick={() => !isOutOfStock && onProductSelect(product)}
            className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left relative ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Out of Stock
                </span>
              </div>
            )}
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-medium truncate">{product.name}</h3>
            <div className="flex justify-between items-center mt-1 flex-wrap">
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
              <p className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                Stock: {product.stock}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductGrid;