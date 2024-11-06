import React, { useState } from 'react';
import { Layout, Home, Package, ClipboardList, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Regulators = () => {
  const [activeComponent, setActiveComponent] = useState('verifyDrugs');
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Aspirin', price: 5.99, quantity: 100, batch: 'ABC123', manufacturer: 'Acme Pharmaceuticals' },
    { id: 2, name: 'Ibuprofen', price: 7.99, quantity: 50, batch: 'DEF456', manufacturer: 'Globex Inc.' },
    { id: 3, name: 'Paracetamol', price: 3.99, quantity: 75, batch: 'GHI789', manufacturer: 'Stark Enterprises' },
  ]);

  const verifyAndDispenseDrug = (medicineId) => {
    // Implement drug verification and dispensation logic
    const medicine = medicines.find((m) => m.id === medicineId);
    alert(`Verifying ${medicine.name} (Batch: ${medicine.batch}, Manufacturer: ${medicine.manufacturer})`);
  };

  const auditSupplyChain = (medicineId) => {
    // Implement supply chain audit logic
    const medicine = medicines.find((m) => m.id === medicineId);
    alert(`Supply Chain Audit for ${medicine.name}:\nBatch: ${medicine.batch}\nManufacturer: ${medicine.manufacturer}`);
  };

  const getDrugDetails = (medicineId) => {
    // Implement drug details retrieval logic
    const medicine = medicines.find((m) => m.id === medicineId);
    alert(`Name: ${medicine.name}\nPrice: $${medicine.price}\nQuantity: ${medicine.quantity}\nBatch: ${medicine.batch}\nManufacturer: ${medicine.manufacturer}`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'verifyDrugs':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Verify Drugs</h2>
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{medicine.name}</h3>
                    <p className="text-gray-500">Batch: {medicine.batch}</p>
                    <p className="text-gray-500">Manufacturer: {medicine.manufacturer}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => verifyAndDispenseDrug(medicine.id)}
                      className="text-green-500 hover:text-green-600"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => auditSupplyChain(medicine.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <AlertTriangle size={18} />
                    </button>
                    <button
                      onClick={() => getDrugDetails(medicine.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Search size={18} />
                    </button>
                  </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Regulator Dashboard</h1>
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
          <NavButton icon={Package} label="Verify Drugs" value="verifyDrugs" />
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default Regulators;