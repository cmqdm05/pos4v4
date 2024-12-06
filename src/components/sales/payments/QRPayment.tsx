import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface QRPaymentProps {
  total: number;
  onSubmit: (details: { referenceNumber: string }) => void;
  onBack: () => void;
}

const QRPayment = ({ total, onSubmit, onBack }: QRPaymentProps) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  
  // Generate a dummy QR code URL (in production, this would be from your payment provider)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY_${total}_${Date.now()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ referenceNumber });
  };

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
        <h2 className="text-xl font-semibold">QR Payment</h2>
      </div>

      <div className="text-2xl font-bold mb-6">${total.toFixed(2)}</div>

      <div className="flex justify-center mb-6">
        <img
          src={qrCodeUrl}
          alt="Payment QR Code"
          className="w-48 h-48 border rounded-lg"
        />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Scan the QR code using your preferred payment app
        </p>
        <p className="text-sm text-gray-600">
          After payment, enter the reference number below
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reference Number
        </label>
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter reference number"
          required
        />
      </div>

      <button
        type="submit"
        disabled={!referenceNumber}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Payment
      </button>
    </form>
  );
};

export default QRPayment;