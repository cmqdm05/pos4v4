import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, History, Tag, Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetProductsQuery } from "../store/services/productService";
import { useGetCategoriesQuery } from "../store/services/categoryService";
import {
  useCreateSaleMutation,
  useGetSalesQuery,
} from "../store/services/saleService";
import { useGetStoreQuery } from "../store/services/storeService";
import ProductGrid from "../components/sales/ProductGrid";
import CategoryFilter from "../components/sales/CategoryFilter";
import CartItem from "../components/sales/CartItem";
import PaymentModal from "../components/sales/PaymentModal";
import Receipt from "../components/sales/Receipt";
import SalesHistory from "../components/sales/SalesHistory";
import DiscountModal from "../components/sales/DiscountModal";
import { CartItem as CartItemType } from "../components/sales/types";

const Sales = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: products } = useGetProductsQuery(storeId!);
  const { data: categories } = useGetCategoriesQuery(storeId!);
  const { data: store } = useGetStoreQuery(storeId!);
  const { data: sales } = useGetSalesQuery(storeId!);
  const [createSale] = useCreateSaleMutation();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  const [orderDiscount, setOrderDiscount] = useState<any>(null);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products?.filter((product: any) => {
    const matchesCategory =
      selectedCategory === "all" || product.category._id === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.product._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          selectedModifiers: [],
          selectedDiscounts: [],
        },
      ]);
    }
    // Show cart on mobile when adding items
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.product._id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const toggleModifier = (itemIndex: number, modifier: any, option: any) => {
    setCart(
      cart.map((item, index) => {
        if (index === itemIndex) {
          const existingModifierIndex = item.selectedModifiers.findIndex(
            (m) => m.name === modifier.name
          );

          let newSelectedModifiers = [...item.selectedModifiers];

          if (existingModifierIndex !== -1) {
            if (
              item.selectedModifiers[existingModifierIndex].option.name ===
              option.name
            ) {
              newSelectedModifiers = newSelectedModifiers.filter(
                (m) => m.name !== modifier.name
              );
            } else {
              newSelectedModifiers[existingModifierIndex] = {
                name: modifier.name,
                option,
              };
            }
          } else {
            newSelectedModifiers.push({
              name: modifier.name,
              option,
            });
          }

          return {
            ...item,
            selectedModifiers: newSelectedModifiers,
          };
        }
        return item;
      })
    );
  };

  const toggleDiscount = (itemIndex: number, discount: any) => {
    setCart(
      cart.map((item, index) => {
        if (index === itemIndex) {
          const hasDiscount = item.selectedDiscounts.some(
            (d) => d.name === discount.name
          );
          return {
            ...item,
            selectedDiscounts: hasDiscount
              ? item.selectedDiscounts.filter((d) => d.name !== discount.name)
              : [...item.selectedDiscounts, discount],
          };
        }
        return item;
      })
    );
  };

  const calculateItemTotal = (item: CartItemType) => {
    let total = item.product.price * item.quantity;
    total += item.selectedModifiers.reduce(
      (sum, modifier) => sum + modifier.option.price * item.quantity,
      0
    );
    item.selectedDiscounts.forEach((discount) => {
      if (discount.type === "percentage") {
        total *= 1 - discount.value / 100;
      } else {
        total -= discount.value * item.quantity;
      }
    });
    return total;
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();
    if (orderDiscount) {
      if (orderDiscount.type === "percentage") {
        const discountAmount = total * (orderDiscount.value / 100);
        total -= orderDiscount.maxDiscount
          ? Math.min(discountAmount, orderDiscount.maxDiscount)
          : discountAmount;
      } else {
        total -= orderDiscount.value;
      }
    }
    return total;
  };

  const handleApplyDiscount = (discount: any) => {
    setOrderDiscount(discount);
    setShowDiscountModal(false);
    toast.success(`Discount "${discount.name}" applied`);
  };

  const handlePayment = async (
    method: "cash" | "card" | "qr",
    details: any
  ) => {
    try {
      const saleData = {
        store: storeId!,
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          modifiers: item.selectedModifiers,
          discounts: [...item.selectedDiscounts, ...(orderDiscount ? [orderDiscount] : [])],
          price: item.product.price,
        })),
        total: calculateTotal(),
        paymentMethod: method,
        paymentDetails: details,
      };

      const result = await createSale(saleData).unwrap();
      setShowPaymentModal(false);
      setLastSaleData({
        ...result,
        paymentMethod: method,
        paymentDetails: details,
      });
      setShowReceipt(true);
      toast.success("Payment processed successfully");
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCart([]);
    setLastSaleData(null);
    setOrderDiscount(null);
    setShowCart(false);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      {/* Mobile Cart Toggle */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="fixed bottom-4 right-4 lg:hidden z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${showCart ? 'hidden' : 'block'} lg:block`}>
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
          <CategoryFilter
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        <ProductGrid
          products={filteredProducts || []}
          onProductSelect={addToCart}
        />
      </div>

      {/* Cart Area */}
      <div
        className={`${
          showCart ? 'fixed inset-0 z-40 bg-white' : 'hidden'
        } lg:relative lg:block lg:w-96 lg:bg-white lg:rounded-lg lg:shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Order
          </h2>
          <button
            onClick={() => setShowCart(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-15rem)]">
          {cart.map((item, index) => (
            <CartItem
              key={item.product._id}
              item={item}
              index={index}
              onRemove={removeFromCart}
              onQuantityChange={updateQuantity}
              onModifierToggle={toggleModifier}
              onDiscountToggle={toggleDiscount}
              calculateItemTotal={calculateItemTotal}
            />
          ))}
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {orderDiscount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({orderDiscount.name}):</span>
                <span>
                  -
                  {orderDiscount.type === "percentage"
                    ? `${orderDiscount.value}%`
                    : `$${orderDiscount.value}`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDiscountModal(true)}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Add Discount</span>
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onPayment={handlePayment}
          onClose={() => setShowPaymentModal(false)}
          total={calculateTotal()}
        />
      )}

      {showReceipt && store && lastSaleData && (
        <Receipt
          items={cart}
          total={calculateTotal()}
          paymentMethod={lastSaleData.paymentMethod}
          date={new Date()}
          storeInfo={{
            name: store.name,
            address: store.address,
            phone: store.phone,
          }}
          onClose={handleCloseReceipt}
          onPrint={handlePrintReceipt}
        />
      )}

      {showHistory && sales && (
        <SalesHistory sales={sales} onClose={() => setShowHistory(false)} />
      )}

      {showDiscountModal && (
        <DiscountModal
          onClose={() => setShowDiscountModal(false)}
          onApplyDiscount={handleApplyDiscount}
          currentTotal={calculateSubtotal()}
        />
      )}
    </div>
  );
};

export default Sales;