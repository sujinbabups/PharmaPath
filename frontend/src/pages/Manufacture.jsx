import React, { useState } from "react";
import { Layout, Home, Package, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    batchId: "",
    drugName: "",
    batchNumber: "",
    expirationDate: "",
    productionDate: "",
    manufacturerId: ""
  });
  const [registeredDrugs, setRegisteredDrugs] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [drugDetails, setDrugDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState("register");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const registerDrug = async () => {
    try {
      const response = await fetch("/api/registerMedicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to register drug");

      const updatedDrugs = await response.json();
      setRegisteredDrugs(updatedDrugs);
      setFormData({
        batchId: "",
        drugName: "",
        batchNumber: "",
        expirationDate: "",
        productionDate: "",
        manufacturerId: ""
      });
    } catch (error) {
      console.error("Error registering drug:", error);
    }
  };

  const fetchDrugDetails = async (e) => {
    e.preventDefault();
    setError(null);
    setDrugDetails(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/getMedicines?batchId=${batchId}`);
      console.log("Response :",response);
      
      if (!response.ok) throw new Error("Failed to fetch drug details");

      const data = await response.json();
      if (data.success) setDrugDetails(data.data);
      
      
      else setError(data.message || "Failed to fetch drug details");
      console.log("Drug details :",drugDetails);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (details) => {
    if (!details) return null;
    const flattenedDetails = Object.entries(details).filter(
      ([, value]) => value != null && typeof value !== "object"
    );

    return (
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Field</th>
              <th className="px-6 py-4 font-medium text-gray-900">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {flattenedDetails.map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </td>
                <td className="px-6 py-4">{value.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                {["batchId", "drugName", "batchNumber", "expirationDate", "productionDate", "manufacturerId"].map(
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
      case "getMedicines":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Medicine Inventory</h2>
          <form onSubmit={fetchDrugDetails} className="space-y-4">
            <input
              type="text"
              name="batchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Enter Batch ID"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4"
            >
              Fetch Drug Details
            </button>
          </form>
          {drugDetails ? renderTable(drugDetails) : <p>No data found.</p>}
        </div>
        );
      case "checkOrder":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
            <div className="p-4 bg-gray-50 rounded-md">Check Order Component</div>
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
              <span>Home</span>
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
            icon={Layout}
            label="Get Medicines"
            value="getMedicines"
            isActive={activeComponent === "getMedicines"}
            onClick={() => setActiveComponent("getMedicines")}
          />
          <NavButton
            icon={ClipboardList}
            label="Check Orders"
            value="checkOrder"
            isActive={activeComponent === "checkOrder"}
            onClick={() => setActiveComponent("checkOrder")}
          />
        </div>
        <div className="transition-all duration-300 ease-in-out">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default Manufacture;
