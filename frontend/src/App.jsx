import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductsTable from './components/ProductsTable';
import AnalyticsTable from './components/AnalyticsTable';
import './index.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/data`); //
      setProducts(response.data.products);
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to load data. Please make sure the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setError(null);
      const response = await axios.put(
        `${API_BASE_URL}/products/${updatedProduct.id}`,
        updatedProduct
      );

      // Update local state
      setProducts(products.map(p =>
        p.id === updatedProduct.id ? response.data : p
      ));

      showSuccessMessage('Product updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/products`, newProduct);

      // Update local state
      setProducts([...products, response.data]);

      showSuccessMessage('Product added successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Product & Order Analytics
          </h1>
          <p className="text-gray-600 text-lg">
            Manage products and analyze order performance in real-time
          </p>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="mb-8">
          <ProductsTable
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Analytics Table */}
        <div>
          <AnalyticsTable
            orders={orders}
            products={products}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with React, Vite, Tailwind CSS, and Express</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
