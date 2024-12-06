import React from "react";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetDiscountsQuery } from "../../store/services/discountService";

interface DiscountModalProps {
  onClose: () => void;
  onApplyDiscount: (discount: any) => void;
  currentTotal: number;
}

const DiscountModal = ({
  onClose,
  onApplyDiscount,
  currentTotal,
}: DiscountModalProps) => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: discounts } = useGetDiscountsQuery(storeId!);

  const getDiscountValue = (discount: any) => {
    if (discount.type === "percentage") {
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
    if (discount.minPurchase && currentTotal < discount.minPurchase)
      return false;

    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply Discount</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {discounts?.filter(isDiscountApplicable).map((discount) => (
            <button
              key={discount._id}
              onClick={() => onApplyDiscount(discount)}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{discount.name}</h3>
                  <p className="text-sm text-gray-500">
                    {discount.description}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {getDiscountValue(discount)}
                </span>
              </div>
              {discount.minPurchase && (
                <p className="text-sm text-gray-500 mt-2">
                  Minimum purchase: ${discount.minPurchase}
                </p>
              )}
            </button>
          ))}

          {(!discounts ||
            discounts.filter(isDiscountApplicable).length === 0) && (
            <p className="text-center text-gray-500 py-4">
              No applicable discounts available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;