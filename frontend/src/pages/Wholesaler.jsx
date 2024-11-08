import React, { useState, useEffect } from 'react';
import { Layout, Home, Package, Truck, ClipboardList, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DistributeModal from '../components/DistributeModal';

const Wholesaler = () => {
  const [activeComponent, setActiveComponent] = useState('inventory');
  const [distributions, setDistributions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pharmacies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);


  // Fetch transferred medicines when the component mounts
  useEffect(() => {
    fetchTransferredMedicines();
  }, []);

  const fetchTransferredMedicines = async () => {
    try {
      const response = await fetch('/api/getTransferedMedicines');
      const data = await response.json();
      console.log("fetched data  :", data);
  
      if (response.ok) {
        // Parse the result string into an array
        const result = JSON.parse(data.result);
        const medicines = result.map((item) => item.Record);
  
        setInventory(medicines);
        console.log("state Value :", medicines);
      } else {
        console.error('Failed to fetch transferred medicines:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transferred medicines:', error);
    }
  };
  

  const createDistribution = (pharmacyId, medicines) => {
    const newDistribution = {
      id: distributions.length + 1,
      pharmacyId,
      medicines,
      status: 'pending',
      date: new Date().toISOString(),
    };
    setDistributions([...distributions, newDistribution]);
  };

  const getLowStockItems = () => {
    if (Array.isArray(inventory)) {
      return inventory.filter(item => item.stock <= 5);
    } else {
      console.error("Inventory is not an array:", inventory);
      return []; // Return an empty array if inventory is not valid
    }
  };

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleDistribute = () => {
    // Handle distribution logic here
    console.log('Distributing:', selectedMedicine);
    closeModal();
  };

  

  const renderInventory = () => (
    
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <div className="bg-red-100 border-2 border-red-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{getLowStockItems().length} items are running low on stock!</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((medicine) => (
          <div key={medicine.id} className={`bg-white p-4 rounded-lg shadow-md ${medicine.stock <= medicine.lowStockAlert ? 'border-2 border-red-200' : ''}`}>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{medicine.drugName}</h3>
              <p className="text-sm text-gray-500">Batch: {medicine.batchNumber}</p>
              <p className="text-sm text-gray-500">Manufacturer: {medicine.owner}</p>
              <p className="text-sm text-gray-500">Expiry: {medicine.expirationDate}</p>
              <p className="text-sm text-gray-500">Status: {medicine.status}</p>
              <button onClick={() => openModal(medicine)}  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition'>
        Distribute
      </button>            </div>
          </div>
        ))}

{isModalOpen && (
        <DistributeModal
          medicine={selectedMedicine}
          onClose={closeModal}
          onDistribute={handleDistribute}
        />
      )}
      </div>
    </div>
  );

  // const renderDistribute = () => (
  //   <div className="space-y-6">
  //     <h2 className="text-2xl font-semibold">Distribute to Pharmacies</h2>
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {pharmacies.map((pharmacy) => (
  //         <div key={pharmacy.id} className="bg-white p-4 rounded-lg shadow-md">
  //           <div className="space-y-2">
  //             <h3 className="text-lg font-medium">{pharmacy.name}</h3>
  //             <p className="text-sm text-gray-500">License: {pharmacy.license}</p>
  //             <p className="text-sm text-gray-500">Address: {pharmacy.address}</p>
  //             <button
  //               onClick={() => createDistribution(pharmacy.id, [])}
  //               className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  //             >
  //               Create Distribution
  //             </button>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  // const renderOrders = () => (
  //   <div className="space-y-6">
  //     <h2 className="text-2xl font-semibold">Distribution History</h2>
  //     <div className="space-y-4">
  //       {distributions.map((dist) => (
  //         <div key={dist.id} className="bg-white p-4 rounded-lg shadow-md">
  //           <div className="space-y-2">
  //             <h3 className="text-lg font-medium">
  //               Distribution #{dist.id} - {pharmacies.find(p => p.id === dist.pharmacyId)?.name}
  //             </h3>
  //             <p className="text-sm text-gray-500">Date: {new Date(dist.date).toLocaleDateString()}</p>
  //             <p className="text-sm text-gray-500">Status: {dist.status}</p>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  const renderCheckOrders = () => (
    <div className="p-4 bg-gray-50 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      <p>Check Order Component</p>
    </div>
  );

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

  const renderComponent = () => {
    switch (activeComponent) {
      case 'inventory':
        return renderInventory();
      // case 'distribute':
      //   return renderDistribute();
      // case 'orders':
      //   return renderOrders();
      case 'checkOrder':
        return renderCheckOrders();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layout className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Wholesaler Dashboard</h1>
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
          <NavButton icon={Package} label="Inventory" value="inventory" />
          {/* <NavButton icon={Truck} label="Distribute" value="distribute" />
          <NavButton icon={ClipboardList} label="Distribution History" value="orders" /> */}
          <NavButton icon={ClipboardList} label="Check Orders" value="checkOrder" />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};

export default Wholesaler;
