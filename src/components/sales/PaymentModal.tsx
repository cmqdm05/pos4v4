import React, { useState } from 'react';
import { CreditCard, Wallet, QrCode, ArrowLeft } from 'lucide-react';
import CashPayment from './payments/CashPayment';
import CardPayment from './payments/CardPayment';
import QRPayment from './payments/QRPayment';

interface PaymentModalProps {
  onPayment: (method: 'cash' | 'card' | 'qr', details: any) => void;
  onClose: () => void;
  total: number;
}

type PaymentMethod = 'select' | 'cash' | 'card' | 'qr';

const PaymentModal = ({ onPayment, onClose, total }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('select');

  const handleBack = () => {
    setSelectedMethod('select');
  };

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'cash':
        return (
          <CashPayment
            total={total}
            onSubmit={(details) => onPayment('cash', details)}
            onBack={handleBack}
          />
        );
      case 'card':
        return (
          <CardPayment
            total={total}
            onSubmit={(details) => onPayment('card', details)}
            onBack={handleBack}
          />
        );
      case 'qr':
        return (
          <QRPayment
            total={total}
            onSubmit={(details) => onPayment('qr', details)}
            onBack={handleBack}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            <p className="text-gray-500 mb-6">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => setSelectedMethod('cash')}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              Pay with Cash
            </button>
            <button
              onClick={() => setSelectedMethod('card')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Pay with Card
            </button>
            <button
              onClick={() => setSelectedMethod('qr')}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <QrCode className="h-5 w-5" />
              Pay with QR
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {renderPaymentMethod()}
      </div>
    </div>
  );
};

export default PaymentModal;