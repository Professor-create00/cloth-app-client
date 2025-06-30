import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import ProductDetails from './pages/ProductDetails'; // adjust path if needed
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from "./pages/EditProduct"; // at the top
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
    
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/:category" element={<CategoryPage />} />

        <Route path="/admin/orders" element={
          <PrivateRoute>
                <AdminOrders />
          </PrivateRoute>
      } />
        <Route path="/admin" element={
          <PrivateRoute>

            <AdminDashboard />
          </PrivateRoute>
          } />
        <Route path="/admin/add" element={
          <PrivateRoute>

            <AddProduct />
          </PrivateRoute>
          } />
        <Route path="/admin/edit/:id" element={
          <PrivateRoute>

            <EditProduct />
          </PrivateRoute>
          } />
        

<Route path="/admin-login" element={<AdminLogin />} />

      </Routes>
    </div>
  );
}

export default App;
