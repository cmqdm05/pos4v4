import React from 'react';
import { X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetDiscountsQuery } from '../../store/services/discountService';
import { CartItem } from './types';

interface ProductDiscountModalProps {
  onClose: () => void;
  onApplyDiscount: (discount: any) => void;
  item: CartItem;
  selectedDiscounts: any[];
}

const ProductDiscountModal = ({ 
  onClose, 
  onApplyDiscount, 
  item,
  selectedDiscounts 
}: ProductDiscountModalProps) => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: discounts } = useGetDiscountsQuery(storeId!);

  const getDiscountValue = (discount: any) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    }
    return `$${discount.value}`;
  };

  const isDiscountApplicable = (discount: any) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    
    if (!discount.active) return false;
    if (now < startDate || now > endDate) return false;
    
    // Check if discount is applicable to this product
    if (discount.applicableProducts && 
        discount.applicableProducts.length > 0 && 
        !discount.applicableProducts.includes(item.product._id)) {
      return false;
    }
    
    return true;
  };

  const isDiscountSelected = (discount: any) => {
    return selectedDiscounts.some(d => d._id === discount._id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Discounts</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-500">
            Unit Price: ${item.product.price.toFixed(2)}
          </p>
        </div>

        <div className="space-y-4">
          {discounts?.filter(isDiscountApplicable).map((discount) => (
            <button
              key={discount._id}
              onClick={() => onApplyDiscount(discount)}
              className={`w-full p-4 border rounded-lg text-left transition-colors ${
                isDiscountSelected(discount)
                  ? 'bg-green-50 border-green-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{discount.name}</h3>
                  <p className="text-sm text-gray-500">{discount.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  isDiscountSelected(discount)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getDiscountValue(discount)}
                </span>
              </div>
            </button>
          ))}

          {(!discounts || discounts.filter(isDiscountApplicable).length === 0) && (
            <p className="text-center text-gray-500 py-4">
              No applicable discounts available for this product
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDiscountModal;