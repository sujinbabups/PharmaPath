import React, { useState } from 'react'

const RegisterDrug = () => {

    const [formData, setFormData] = useState({
        batchId: "",
        drugName: "",
        batchNumber: "",
        expirationDate: "",
        productionDate: "",
        manufacturerId: ""
      });
      const [registeredDrugs, setRegisteredDrugs] = useState([]);


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
            headers: {
              "Content-Type": "application/json",
            },
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
  return (
  <>
   <section className="drug-registration-form bg-white shadow-md rounded p-6 mb-10 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Register a New Drug</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {["batchId", "drugName", "batchNumber", "expirationDate", "productionDate", "manufacturerId"].map((field) => (
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
          ))}
          <button
            type="button"
            onClick={registerDrug}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4" >
            Register Drug
          </button>
        </form>
      </section>

  </>
  )
}

export default RegisterDrug
