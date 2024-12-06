import React from 'react';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { CartItem } from './types';

interface ReceiptProps {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: Date;
  storeInfo: {
    name: string;
    address: string;
    phone: string;
  };
  onClose: () => void;
  onPrint: () => void;
}

const Receipt = ({
  items,
  total,
  paymentMethod,
  date,
  storeInfo,
  onClose,
  onPrint,
}: ReceiptProps) => {
  const calculateItemOriginalTotal = (item: CartItem) => {
    const originalTotal = item.product.price * item.quantity;
    const modifierTotal = item.selectedModifiers.reduce(
      (sum, modifier) => sum + modifier.option.price * item.quantity,
      0
    );
    return originalTotal + modifierTotal;
  };

  const calculateItemDiscountedTotal = (item: CartItem) => {
    let total = calculateItemOriginalTotal(item);

    item.selectedDiscounts.forEach((discount) => {
      if (discount.type === 'percentage') {
        total *= (1 - discount.value / 100);
      } else {
        total -= discount.value * item.quantity;
      }
    });

    return total;
  };

  const hasAnyDiscounts = items.some(
    item => item.selectedDiscounts.length > 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <ReceiptIcon className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
          <h2 className="text-2xl font-bold">{storeInfo.name}</h2>
          <p className="text-gray-500">{storeInfo.address}</p>
          <p className="text-gray-500">{storeInfo.phone}</p>
        </div>

        <div className="border-t border-b py-4 mb-4">
          <div className="space-y-3">
            {items.map((item, index) => {
              const originalTotal = calculateItemOriginalTotal(item);
              const discountedTotal = calculateItemDiscountedTotal(item);
              const hasDiscount = item.selectedDiscounts.length > 0;

              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <div className="text-right">
                      {hasDiscount ? (
                        <>
                          <span className="line-through text-gray-500">
                            ${originalTotal.toFixed(2)}
                          </span>
                          <span className="ml-2 text-green-600 font-medium">
                            ${discountedTotal.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>${originalTotal.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {item.selectedModifiers.map((modifier, idx) => (
                    <div key={idx} className="text-xs text-gray-500 ml-4 flex justify-between">
                      <span>+ {modifier.name}: {modifier.option.name}</span>
                      <span>${(modifier.option.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  {item.selectedDiscounts.map((discount, idx) => (
                    <div key={idx} className="text-xs text-green-600 ml-4">
                      {discount.name} ({
                        discount.type === 'percentage'
                          ? `-${discount.value}%`
                          : `-$${discount.value}`
                      })
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {hasAnyDiscounts && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Original Total</span>
              <span className="line-through text-gray-500">
                ${items.reduce((sum, item) => sum + calculateItemOriginalTotal(item), 0).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Payment Method</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Date</span>
            <span>{date.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPrint}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;