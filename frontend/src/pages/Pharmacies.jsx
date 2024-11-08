import React, { useEffect, useState } from 'react';
import { Layout, Home, Package, ClipboardList, Trash, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewOrderModal from '../components/NewOrderModal';

const Pharmacies = () => {
  const [activeComponent, setActiveComponent] = useState('viewMedicines');
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeComponent === 'viewMedicines') {
      fetchMedicinesInTransit();
    } else if (activeComponent === 'manageOrder') {
      fetchOrders();
    }
  }, [activeComponent]);

  const fetchMedicinesInTransit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getTransitMedicine');
      const data = await response.json();

      if (response.ok && data && data.data) {
        const medicines = data.data.map((item) => item.Record);
        setMedicines(medicines);
        setLoading(false);
      } else {
        console.error('Failed to fetch medicines:', data.error || "Unknown error");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setLoading(false);
    }
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/readAllOrders', { method: 'GET' });
      const data = await response.json();
  
      if (response.ok && Array.isArray(data.data)) { // Ensure data.data is an array
        setOrders(data.data); // Assuming data.data is an array of orders
        setLoading(false);
      } else {
        console.error('Failed to fetch orders:', data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };
  
  

  // const viewMedicineDetails = (medicineId) => {
  //   // Implement medicine details view logic
  //   const medicine = medicines.find((m) => m.id === medicineId);
  //   alert(`Name: ${medicine.drugName}\nQuantity: ${medicine.quantity}\nQuantity: ${medicine.owner}`);
  // };

  const createOrder = (orderData) => {
    console.log("Sending order data:", orderData);  // Log the request data
    fetch('/api/newOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response:", data);  // Log the response data
        if (data.success) {
          setOrders([...orders, data.data]);
          alert('Order created successfully!');
        } else {
          console.error("Backend error:", data.data.error);  // Log backend error details
          alert('Error creating order.');
        }
      })
      .catch((error) => console.error('Fetch error:', error));
  };
  
  const renderComponent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    switch (activeComponent) {
      case 'viewMedicines':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine.batchId}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{medicine.drugName}</h3>
                    <p className="text-gray-500">Expiry: {medicine.expirationDate}</p>
                    <p className="text-gray-500">Quantity: {medicine.quantity}</p>
                    <p className="text-gray-500">Manufacturer ID: {medicine.manufacturerId}</p>
                  </div>
                  {/* <button
                    onClick={() => viewMedicineDetails(medicine.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View Details */}
                  {/* </button> */}
                </div>
              ))}
            </div>
          </div>
        );

        case 'manageOrder':
          return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div
                      key={order.orderId || index} // Use index as a fallback if orderId is missing
                      className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                    >
                      <div>Order #{order.orderId || 'Unknown ID'}</div> {/* Fallback text if orderId is missing */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => deleteOrder(order.orderId)}
                          className="text-red-500 hover:text-red-600"
                          disabled={!order.orderId} // Disable button if orderId is missing
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No orders available.</p>
                )}
              </div>
            </div>
          );
        

      case 'createOrder':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Order
            </button>
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layout className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            </div>
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Home size={20} />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <NavButton icon={Search} label="View Medicines" value="viewMedicines" />
          <NavButton icon={Package} label="Create Order" value="createOrder" />
          <NavButton icon={ClipboardList} label="Manage Orders" value="manageOrder" />
        </div>

        <div className="transition-all duration-300 ease-in-out">{renderComponent()}</div>
        <NewOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createOrder}
        />
      </main>
    </div>
  );
};

export default Pharmacies;
