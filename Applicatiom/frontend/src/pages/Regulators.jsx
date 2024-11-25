import React, { useEffect, useState } from 'react';
import { Layout, Home, Package, ClipboardList, AlertTriangle, CheckCircle, Search, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Regulators = () => {
  const [activeComponent, setActiveComponent] = useState('verifyDrugs');
  const [medicineId, setMedicineId] = useState('');
  const [historyData, setHistoryData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const [medicines, setMedicines] = useState([]);

 

  const getHistory = async () => {
    setLoading(true);
    setError(null);
    setHistoryData(null); 

    try {
      const response = await fetch(`/api/getHistory?batchId=${medicineId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId: medicineId }), 
      });

      const data = await response.json();
      if (response.ok) {
        setHistoryData(data.data); // Update state with history data
      } else {
        setError(data.message || 'Failed to retrieve history.');
      }
    } catch (err) {
      setError('Error retrieving history data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const fetchAllMedicines = async (signal) => {
      setError(null);
      
      try {
        const response = await fetch("/api/allMedicines", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.success) {
          const medicines = data.data.map((item) => item.Record);
          setMedicines(medicines);
          console.log("all medidicines :",medicines);
          
        } else {
          throw new Error(data.message || "Failed to fetch medicines");
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error("Error:", err);
        setError(err.message || "An error occurred while fetching medicines.");
      } finally {
      }
    };
    fetchAllMedicines();

  }, []);

  const verifyMedicine = async (batchId) => {
    const remarks = prompt("Enter remarks for verification:");
    if (!remarks) return;
  
    try {
      const response = await fetch(`/api/verifyMedicine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId, remarks, status: "verified" }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Medicine verified successfully!');
        // Optionally, refetch the list or update the specific item in the list
      } else {
        alert(data.message || 'Failed to verify medicine.');
      }
    } catch (err) {
      alert('Error verifying medicine.');
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'verifyDrugs':
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Verify Drugs</h2>
          <div className="space-y-4">
            {medicines && medicines.length > 0 ? (
              medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium">{medicine.drugName}</h3>
                    <p className="text-gray-500">Batch: {medicine.batchId}</p>
                    <p className="text-gray-500">Manufacturer: {medicine.owner}</p>
                    <p className="text-gray-500">Expiry Date: {medicine.expirationDate}</p>
                    <p className='text-gray-500'>Status :{medicine.status}</p>
                    <p className="text-gray-500">Condition: {medicine.transportConditions}</p>


                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => verifyMedicine(medicine.batchId)}
                      className="text-green-500 hover:text-green-600"
                    >
                      <CheckCircle size={18} />
                    </button>
                    {/* <button
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
                    <button
                      onClick={() => {
                        setMedicineId(medicine.batch);
                        getHistory();
                      }}
                      className="text-purple-500 hover:text-purple-600"
                    >
                      <History size={18} />
                    </button> */}
                  </div>
                </div>
              ))
            ) : (
              <p>No medicines found.</p>
            )}
          </div>
        </div>
      );
      case 'getHistory':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Get Medicine History</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Batch ID"
                value={medicineId}
                onChange={(e) => setMedicineId(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={getHistory}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Show History
              </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {historyData && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">History Data:</h3>
                <pre className="bg-gray-100 p-4 rounded-md mt-2">{JSON.stringify(historyData, null, 2)}</pre>
              </div>
            )}
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
              <h1 className="text-2xl font-bold text-gray-900">Regulator Dashboard</h1>
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
          <NavButton icon={Package} label="Verify Drugs" value="verifyDrugs" />
          <NavButton icon={ClipboardList} label="Get History" value="getHistory" />
        </div>
        <div className="transition-all duration-300 ease-in-out">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default Regulators;
