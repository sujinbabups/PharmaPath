import React, { useState } from 'react';
import { Layout, Home, Package, ClipboardList, Trash, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pharmacies = () => {
  const [activeComponent, setActiveComponent] = useState('createOrder');
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Aspirin', price: 5.99, quantity: 100 },
    { id: 2, name: 'Ibuprofen', price: 7.99, quantity: 50 },
    { id: 3, name: 'Paracetamol', price: 3.99, quantity: 75 },
  ]);

  const createOrder = () => {
    // Implement order creation logic
    const newOrder = { id: orders.length + 1, items: [], total: 0 };
    setOrders([...orders, newOrder]);
    setActiveComponent('manageOrder');
  };

  const deleteOrder = (orderId) => {
    // Implement order deletion logic
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const viewMedicineDetails = (medicineId) => {
    // Implement medicine details view logic
    const medicine = medicines.find((m) => m.id === medicineId);
    alert(`Name: ${medicine.name}\nPrice: $${medicine.price}\nQuantity: ${medicine.quantity}`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'createOrder':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>
            <button
              onClick={createOrder}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <PlusCircle size={18} />
              <span>Create Order</span>
            </button>
          </div>
        );
      case 'manageOrder':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                >
                  <div>Order #{order.id}</div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'viewMedicines':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">View Medicine Details</h2>
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{medicine.name}</h3>
                    <p className="text-gray-500">Price: ${medicine.price}</p>
                    <p className="text-gray-500">Quantity: {medicine.quantity}</p>
                  </div>
                  <button
                    onClick={() => viewMedicineDetails(medicine.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const NavButton = ({ icon: Icon, label, value }) => (
    <button
      onClick={() => setActiveComponent(value)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
        activeComponent === value
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layout className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            </div>
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Home size={20} />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <NavButton icon={Package} label="Create Order" value="createOrder" />
          <NavButton icon={ClipboardList} label="Manage Orders" value="manageOrder" />
          <NavButton icon={Search} label="View Medicines" value="viewMedicines" />
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default Pharmacies;