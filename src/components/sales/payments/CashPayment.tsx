import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CashPaymentProps {
  total: number;
  onSubmit: (details: { amountPaid: number; change: number }) => void;
  onBack: () => void;
}

const CashPayment = ({ total, onSubmit, onBack }: CashPaymentProps) => {
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const paid = parseFloat(amountPaid) || 0;
    setChange(paid - total);
  }, [amountPaid, total]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paid = parseFloat(amountPaid);
    if (paid >= total) {
      onSubmit({ amountPaid: paid, change });
    }
  };

  // Calculate quick amounts and ensure they're unique
  const quickAmounts = Array.from(
    new Set([
      total, // Exact amount
      Math.ceil(total / 5) * 5, // Round up to nearest 5
      Math.ceil(total / 10) * 10, // Round up to nearest 10
      Math.ceil(total / 20) * 20, // Round up to nearest 20
    ])
  ).sort((a, b) => a - b);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold">Cash Payment</h2>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Total Amount
        </label>
        <div className="text-2xl font-bold">${total.toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quick Amount
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={`amount-${amount}`}
              type="button"
              onClick={() => setAmountPaid(amount.toString())}
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              ${amount.toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Amount Received
        </label>
        <input
          type="number"
          step="0.01"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Change</label>
        <div className={`text-xl font-bold ${change < 0 ? 'text-red-600' : ''}`}>
          ${change.toFixed(2)}
        </div>
      </div>

      <button
        type="submit"
        disabled={parseFloat(amountPaid) < total}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Payment
      </button>
    </form>
  );
};

export default CashPayment;