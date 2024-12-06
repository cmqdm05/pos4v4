import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BarChart2, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp,
  Download
} from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { utils, writeFile } from 'xlsx';
import { useGetSalesQuery } from '../store/services/saleService';
import SalesChart from '../components/reports/SalesChart';
import ReportCard from '../components/reports/ReportCard';
import DateRangePicker from '../components/reports/DateRangePicker';

const Reports = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: sales } = useGetSalesQuery(storeId!);
  const [startDate, setStartDate] = useState(
    format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredSales = useMemo(() => {
    if (!sales) return [];
    
    return sales.filter((sale) => {
      const saleDate = parseISO(sale.createdAt);
      return isWithinInterval(saleDate, {
        start: startOfDay(parseISO(startDate)),
        end: endOfDay(parseISO(endDate)),
      });
    });
  }, [sales, startDate, endDate]);

  const metrics = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
    };
  }, [filteredSales]);

  const chartData = useMemo(() => {
    const dailySales = filteredSales.reduce((acc: any, sale) => {
      const date = format(parseISO(sale.createdAt), 'MMM dd');
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});

    return Object.entries(dailySales).map(([name, sales]) => ({
      name,
      sales,
    }));
  }, [filteredSales]);

  const exportToExcel = () => {
    const data = filteredSales.map((sale) => ({
      'Date': format(parseISO(sale.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      'Order ID': sale._id,
      'Payment Method': sale.paymentMethod,
      'Total': sale.total,
      'Items': sale.items.map(item => 
        `${item.product.name} (x${item.quantity})`
      ).join(', '),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sales Report');
    writeFile(wb, `sales-report-${startDate}-to-${endDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart2 className="h-6 w-6" />
          Reports
        </h1>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
      </div>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard
          title="Total Sales"
          value={`$${metrics.totalSales.toFixed(2)}`}
          icon={DollarSign}
        />
        <ReportCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingBag}
        />
        <ReportCard
          title="Average Order Value"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          icon={TrendingUp}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Sales Trend</h2>
        <SalesChart data={chartData} />
      </div>
    </div>
  );
};

export default Reports;