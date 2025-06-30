
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || username !== "admin") {
      navigate("/admin/orders", { state: { from: location.pathname } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, location.pathname]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
      setOrders(prev => prev.filter(order => order._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">All Orders</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found.
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{order.productName}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p><span className="font-semibold">Name:</span> {order.name}</p>
                      <p><span className="font-semibold">Phone:</span> {order.phone}</p>
                      <p className="truncate"><span className="font-semibold">Address:</span> {order.address}</p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(order._id)}
                      className="mt-2 w-full py-1.5 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-green-300 text-left">
                  <tr>
                    <th className="p-3 border text-sm md:text-base">Name</th>
                    <th className="p-3 border text-sm md:text-base">Phone</th>
                    <th className="p-3 border text-sm md:text-base">Address</th>
                    <th className="p-3 border text-sm md:text-base">Product</th>
                    <th className="p-3 border text-sm md:text-base">Time</th>
                    <th className="p-3 border text-sm md:text-base">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-blue-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-red-200">
                      <td className="p-3 border text-sm md:text-base">{order.name}</td>
                      <td className="p-3 border text-sm md:text-base">{order.phone}</td>
                      <td className="p-3 border text-sm md:text-base max-w-xs truncate">{order.address}</td>
                      <td className="p-3 border text-sm md:text-base">{order.productName}</td>
                      <td className="p-3 border text-sm md:text-base">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="p-3 border">
                        <button
                          onClick={() => setDeleteConfirm(order._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm md:text-base"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this order?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;

