import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, AlertTriangle, ArrowDown, ArrowUp, History } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useGetProductsQuery } from '../store/services/productService';
import { 
  useGetStockMovementsQuery,
  useAddStockMovementMutation,
  useGetStockAlertsQuery,
  useUpdateStockAlertMutation,
} from '../store/services/inventoryService';

const Inventory = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: products } = useGetProductsQuery(storeId!);
  const { data: stockMovements } = useGetStockMovementsQuery(storeId!);
  const { data: stockAlerts } = useGetStockAlertsQuery(storeId!);
  const [addStockMovement] = useAddStockMovementMutation();
  const [updateStockAlert] = useUpdateStockAlertMutation();

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStockMovement({
        product: selectedProduct,
        type: movementType,
        quantity: movementType === 'in' ? quantity : -quantity,
        reason,
        store: storeId,
      }).unwrap();
      toast.success('Stock movement recorded successfully');
      setShowMovementModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to record stock movement');
    }
  };

  const resetForm = () => {
    setSelectedProduct('');
    setMovementType('in');
    setQuantity(0);
    setReason('');
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await updateStockAlert({
        _id: alertId,
        status: 'resolved',
      }).unwrap();
      toast.success('Alert marked as resolved');
    } catch (error) {
      toast.error('Failed to update alert');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6" />
          Inventory Management
        </h1>
        <button
          onClick={() => setShowMovementModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <History className="h-4 w-4 mr-2" />
          Record Movement
        </button>
      </div>

      {/* Stock Alerts */}
      {stockAlerts && stockAlerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <h2 className="ml-2 text-lg font-medium text-yellow-800">Stock Alerts</h2>
          </div>
          <div className="mt-2 space-y-2">
            {stockAlerts.map((alert) => (
              <div
                key={alert._id}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {products?.find((p) => p._id === alert.product)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {alert.type === 'low_stock'
                      ? `Low stock alert (Below ${alert.threshold})`
                      : 'Out of stock alert'}
                  </p>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleResolveAlert(alert._id)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Movements History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Stock Movements</h3>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockMovements?.map((movement) => (
                <tr key={movement._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {products?.find((p) => p._id === movement.product)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'in'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {movement.type === 'in' ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {movement.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Math.abs(movement.quantity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{movement.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(movement.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Record Stock Movement</h2>
            <form onSubmit={handleAddMovement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select product</option>
                  {products?.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Movement Type
                </label>
                <div className="mt-1 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="in"
                      checked={movementType === 'in'}
                      onChange={(e) => setMovementType(e.target.value as 'in')}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Stock In</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="out"
                      checked={movementType === 'out'}
                      onChange={(e) => setMovementType(e.target.value as 'out')}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Stock Out</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMovementModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Record Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;