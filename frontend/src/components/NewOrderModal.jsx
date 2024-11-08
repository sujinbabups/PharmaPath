import React, { useState } from 'react'

const NewOrderModal = ({isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        batchId: '',
        drugName: '',
        dosage: '',
        quantity: '',
        pharmacyName: '',
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose(); 
      };
    
      if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order ID</label>
          <input
            type="text"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Drug Name</label>
          <input
            type="text"
            name="drugName"
            value={formData.drugName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
          <input
            type="text"
            name="pharmacyName"
            value={formData.pharmacyName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default NewOrderModal
