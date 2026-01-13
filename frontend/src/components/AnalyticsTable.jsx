import { useState, useEffect } from 'react';
import { calculateOrderAnalytics } from '../utils/calculations';

const AnalyticsTable = ({ orders, products }) => {
    const [analytics, setAnalytics] = useState([]);

    const recalculate = () => {
        const calculatedAnalytics = orders.map(order =>
            calculateOrderAnalytics(order, products)
        );
        setAnalytics(calculatedAnalytics);
    };

    // Initial calculation on mount and when data changes
    useEffect(() => {
        recalculate();
    }, [orders, products]);

    const formatCurrency = (value) => {
        return `$${value.toFixed(1)}`;
    };

    const formatPercentage = (value) => {
        return `${value.toFixed(1)}%`;
    };

    const getMarginColor = (margin) => {
        if (margin >= 30) return 'text-green-700 font-bold';
        if (margin >= 15) return 'text-blue-700 font-semibold';
        if (margin >= 0) return 'text-yellow-700 font-medium';
        return 'text-red-700 font-bold';
    };

    const getProfitColor = (profit) => {
        if (profit >= 0) return 'text-green-700 font-semibold';
        return 'text-red-700 font-semibold';
    };

    return (
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Order Analytics</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Real-time calculations based on current product pricing
                        </p>
                    </div>
                    <button
                        onClick={recalculate}
                        className="btn btn-primary"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Recalculate
                        </span>
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order No.</th>
                                <th className="text-right">Gross Sales</th>
                                <th className="text-right">Discounts</th>
                                <th className="text-right">Taxes</th>
                                <th className="text-right">Shipping</th>
                                <th className="text-right">Sales</th>
                                <th className="text-right">Total COGS</th>
                                <th className="text-right">Gross Profit</th>
                                <th className="text-right">Gross Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.map((row, index) => (
                                <tr key={row.orderNo} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                                    <td className="font-semibold text-primary-700">{row.orderNo}</td>
                                    <td className="text-right font-medium">{formatCurrency(row.grossSales)}</td>
                                    <td className="text-right text-red-600">{formatCurrency(row.discounts)}</td>
                                    <td className="text-right text-blue-600">{formatCurrency(row.taxes)}</td>
                                    <td className="text-right text-purple-600">{formatCurrency(row.shipping)}</td>
                                    <td className="text-right font-bold text-gray-900 bg-blue-50">
                                        {formatCurrency(row.sales)}
                                    </td>
                                    <td className="text-right font-semibold text-orange-700">
                                        {formatCurrency(row.totalCOGS)}
                                    </td>
                                    <td className={`text-right ${getProfitColor(row.grossProfit)} bg-green-50`}>
                                        {formatCurrency(row.grossProfit)}
                                    </td>
                                    <td className={`text-right ${getMarginColor(row.grossMargin)} bg-gradient-to-r from-yellow-50 to-green-50`}>
                                        {formatPercentage(row.grossMargin)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 font-bold">
                            <tr>
                                <td className="text-gray-700">TOTALS</td>
                                <td className="text-right text-gray-900">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.grossSales, 0))}
                                </td>
                                <td className="text-right text-red-700">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.discounts, 0))}
                                </td>
                                <td className="text-right text-blue-700">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.taxes, 0))}
                                </td>
                                <td className="text-right text-purple-700">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.shipping, 0))}
                                </td>
                                <td className="text-right text-gray-900 bg-blue-100">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.sales, 0))}
                                </td>
                                <td className="text-right text-orange-800">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.totalCOGS, 0))}
                                </td>
                                <td className="text-right text-green-800 bg-green-100">
                                    {formatCurrency(analytics.reduce((sum, row) => sum + row.grossProfit, 0))}
                                </td>
                                <td className="text-right text-gray-900 bg-gradient-to-r from-yellow-100 to-green-100">
                                    {formatPercentage(
                                        analytics.reduce((sum, row) => sum + row.grossProfit, 0) /
                                        analytics.reduce((sum, row) => sum + row.sales, 0) * 100
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <div className="text-sm text-blue-700 font-medium">Total Sales</div>
                        <div className="text-2xl font-bold text-blue-900 mt-1">
                            {formatCurrency(analytics.reduce((sum, row) => sum + row.sales, 0))}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                        <div className="text-sm text-green-700 font-medium">Total Profit</div>
                        <div className="text-2xl font-bold text-green-900 mt-1">
                            {formatCurrency(analytics.reduce((sum, row) => sum + row.grossProfit, 0))}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                        <div className="text-sm text-purple-700 font-medium">Average Margin</div>
                        <div className="text-2xl font-bold text-purple-900 mt-1">
                            {formatPercentage(
                                analytics.reduce((sum, row) => sum + row.grossProfit, 0) /
                                analytics.reduce((sum, row) => sum + row.sales, 0) * 100
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTable;
