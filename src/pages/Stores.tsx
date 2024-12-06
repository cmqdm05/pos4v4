import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetStoresQuery, useDeleteStoreMutation } from '../store/services/storeService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Stores = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: stores, isLoading, error, refetch } = useGetStoresQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });
  const [deleteStore] = useDeleteStoreMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user?.email, refetch]); // Use user.email as dependency to ensure proper updates

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(id).unwrap();
        toast.success('Store deleted successfully');
      } catch (error) {
        toast.error('Failed to delete store');
      }
    }
  };

  const handleStoreSelect = (storeId: string) => {
    localStorage.setItem('selectedStoreId', storeId);
    navigate(`/stores/${storeId}/dashboard`);
  };

  // Show loading state when user exists but data is loading
  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load stores. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Store className="h-6 w-6" />
          Stores
        </h1>
        <Link
          to="/stores/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Link>
      </div>

      {!stores || stores.length === 0 ? (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stores</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new store.</p>
          <div className="mt-6">
            <Link
              to="/stores/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div 
              key={store._id} 
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleStoreSelect(store._id)}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Store className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {store.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-sm text-gray-900">
                          {store.address}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/stores/${store._id}/categories`);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(store._id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;