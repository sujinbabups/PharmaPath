import React, {  useState } from "react";
import { Layout, Home, Package, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import TransferModal from "../components/TransferModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const initialFormState = {
  batchId: "",
  drugName: "",
  batchNumber: "",
  quantity:"",
  expirationDate: "",
  productionDate: "",
  manufacturerId: ""
};

const NavButton = ({ icon: Icon, label, value, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Manufacture = () => {

  const [formData, setFormData] = useState(initialFormState);
  const [registeredDrugs, setRegisteredDrugs] = useState([]);
  const [searchBatchId, setSearchBatchId] = useState("");
  const [searchedDrug, setSearchedDrug] = useState([]);
  const [allDrugs, setAllDrugs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState("register");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const registerDrug = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/registerMedicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register drug");
      }
      
      


      setRegisteredDrugs(data);
      setFormData(initialFormState);
      toast.success("Drug registered successfully!");
      if (activeComponent === "allMedicines") {
        fetchAllMedicines();
      }
    } catch (error) {
      setError(error.message);
      console.error("Error registering drug:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMedicines = async (signal) => {
    setError(null);
    setIsLoading(true);
    
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
        setAllDrugs(medicines);
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
      setIsLoading(false);
    }
  };




  const searchMedicineById = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    setError(null);
    setIsLoading(true);
    setSearchedDrug([]);
  
    try {
      const response = await fetch(`/api/getMedicines?batchId=${searchBatchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (data.success) {
        // Check if data.data is an array; if not, wrap it in an array
        const drugs = Array.isArray(data.data) ? data.data : [data.data];
        setSearchedDrug(drugs.map((item) => item.Record || item));
        console.log("Searched medicine details:", drugs);
      } else {
        setError(data.message || "Failed to fetch medicines.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while fetching medicines.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteMedicine = async () => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/deleteMedicine", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId: searchBatchId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete medicine");
      }

      if (data.success) {
        setSuccessMessage("Medicine deleted successfully!");
        toast.success("Deleted")
        setSearchedDrug([]);
        setSearchBatchId("");
        
        // Refresh all drugs list if we're showing it
        if (activeComponent === "allMedicines") {
          fetchAllMedicines();
        }
      } else {
        throw new Error(data.message || "Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred while trying to delete the medicine.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    if (activeComponent === "allMedicines") {
      fetchAllMedicines(controller.signal);
    }

    return () => {
      controller.abort();
    };
  }, [activeComponent]);

  useEffect(() => {
    setError(null);
    setSuccessMessage("");
  }, [activeComponent]);


  const handleTransferClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleTransfer = async (medicineId, wholesalerId) => {
    try {
      const response = await fetch('/api/transferToWholesaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId: medicineId, wholesalerId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Medicine transferred to wholesaler successfully!');
      } else {
        alert(data.message || 'Failed to transfer medicine to wholesaler.');
      }
    } catch (err) {
      alert('Error transferring medicine to wholesaler.');
    }
  };

 
  
  // Render the table rows
  const renderAllMedicinesTable = () => {
 
    return (
      <table className="min-w-full border-collapse bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border-b">Medicine Id</th>
            <th className="px-4 py-2 border-b">Drug Name</th>
            <th className="px-4 py-2 border-b">Batch Number</th>
            <th className="px-4 py-2 border-b">Quantity</th>         
            <th className="px-4 py-2 border-b">Expiration Date</th>
            <th className="px-4 py-2 border-b">Manufacturer ID</th>
            {/* <th className="px-4 py-2 border-b">Owner</th> */}
            <th className="px-4 py-2 border-b">Production Date</th>
            <th className="px-4 py-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {allDrugs.map((medicine, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{medicine.batchId}</td>
              <td className="px-4 py-2 border-b">{medicine.drugName}</td>
              <td className="px-4 py-2 border-b">{medicine.batchNumber}</td>
              <td className="px-4 py-2 border-b">{medicine.quantity}</td>
              <td className="px-4 py-2 border-b">{medicine.expirationDate}</td>
              <td className="px-4 py-2 border-b">{medicine.manufacturerId}</td>
              {/* <td className="px-4 py-2 border-b">{medicine.owner}</td> */}
              <td className="px-4 py-2 border-b">{medicine.productionDate}</td>
              <td className="px-4 py-2 border-b">{medicine.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

 const renderSearchedMedicineTable = () => {
  if (!Array.isArray(searchedDrug) || searchedDrug.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No medicine found
      </div>
    );
  }

  return (
    <>   <ToastContainer/>
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Field</th>
            <th className="px-6 py-4 font-medium text-gray-900">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {searchedDrug.map((drugs, index) => (
            <React.Fragment key={index}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Batch Id</td>
                <td className="px-6 py-4">{drugs.batchId || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Drug Name</td>
                <td className="px-6 py-4">{drugs.drugName || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Batch Number</td>
                <td className="px-6 py-4">{drugs.batchNumber || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Quantity</td>
                <td className="px-6 py-4">{drugs.quantity || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Expiry Date</td>
                <td className="px-6 py-4">{drugs.expirationDate || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Production Date</td>
                <td className="px-6 py-4">{drugs.productionDate || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Manufacture Id</td>
                <td className="px-6 py-4">{drugs.manufacturerId || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Medicine Status</td>
                <td className="px-6 py-4">{drugs.status || "N/A"}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="p-4 flex gap-4">

      <button onClick={handleTransferClick}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Transfer to Wholesaler
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={deleteMedicine}
        >
          Delete Medicine
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          
        >
          Cancel
        </button>
        <TransferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTransfer={handleTransfer}
      />
      </div>
    </div>
    </>
    
  );
};




  const renderComponent = () => {
    
    switch (activeComponent) {
      case "register":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Register New Medicine</h2>
            <section className="drug-registration-form bg-white shadow-md rounded p-6 mb-10 max-w-lg mx-auto">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {["batchId", "drugName", "batchNumber","quantity", "expirationDate", "productionDate", "manufacturerId"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field.includes("Date") ? "date" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                  )
                )}
                <button
                  type="button"
                  onClick={registerDrug}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4"
                >
                  Register Drug
                </button>
              </form>
            </section>
          </div>
        );
        case "allMedicines":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Registered Medicines</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              renderAllMedicinesTable()
            )}
          </div>
        );

        case "getMedicines":
          return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Search Medicine by ID</h2>
              <form onSubmit={(e) => searchMedicineById(e)} className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Enter Batch ID"
                  value={searchBatchId}
                  onChange={(e) => setSearchBatchId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </form>
              {isLoading ? (
                <p className="mt-4">Loading...</p>
              ) : error ? (
                <p className="mt-4 text-red-600">{error}</p>
              ) : (
                renderSearchedMedicineTable()
              )}
            </div>
          );

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
              <h1 className="text-2xl font-bold text-gray-900">Manufacturer Dashboard</h1>
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
          <NavButton
            icon={Package}
            label="Register Medicines"
            value="register"
            isActive={activeComponent === "register"}
            onClick={() => setActiveComponent("register")}
          />
           <NavButton
            icon={Package}
            label="All Medicines"
            value="allMedicines"
            isActive={activeComponent === "allMedicines"}
            onClick={() => setActiveComponent("allMedicines")}
          />
          <NavButton
            icon={Layout}
            label="Get Medicines"
            value="getMedicines"
            isActive={activeComponent === "getMedicines"}
            onClick={() => setActiveComponent("getMedicines")}
          />
  
        </div>

        {renderComponent()}
      </main>
    </div>
   
  );
};

export default Manufacture;
