import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutGrid, TrendingUp, Package, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetStoreQuery } from '../store/services/storeService';

const DashboardCard = ({ title, value, icon: Icon, link, color }: any) => (
  <Link to={link} className="block">
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: store } = useGetStoreQuery(storeId!);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Store Info"
          value={store?.name || 'Loading...'}
          icon={LayoutGrid}
          link={`/stores/${storeId}/categories`}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Today's Sales"
          value="$0.00"
          icon={TrendingUp}
          link={`/stores/${storeId}/sales`}
          color="bg-green-500"
        />
        <DashboardCard
          title="Products"
          value="View All"
          icon={Package}
          link={`/stores/${storeId}/products`}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Reports"
          value="View All"
          icon={Receipt}
          link={`/stores/${storeId}/reports`}
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;