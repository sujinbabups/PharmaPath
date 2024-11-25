import React, { useState } from 'react'

const DistributeModal = ({ medicine, onClose, onDistribute }) => {
  const [deliveryTime, setDeliveryTime] = useState('');
  const [transportConditions, setTransportConditions] = useState('');
  const [quantity, setQuantity] = useState(medicine ? medicine.quantity : 0); 

  const handleDistribute = async () => {
    try {
      const response = await fetch('/api/distributeDrug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: medicine.batchId,
          wholesalerId: 'WholesalerID123', // or from context if available
          transitTime: deliveryTime,
          condition: transportConditions,
          quantity: quantity,
        }),
      });


      const result = await response.json();

      if (response.ok) {
        console.log("Distribution Success:", result.message);
      } else {
        console.error("Distribution Failed:", result.message);
      }

      onClose(); // Close modal after submission
    } catch (error) {
      console.error("Error distributing drug:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Distribute Medicine</h2>
        
        <p><strong>Batch ID:</strong> {medicine.batchId}</p>
        <p><strong>Name:</strong> {medicine.drugName}</p>
        
        {/* Delivery Time Input */}
        <label className="block mt-4">
          <span>Delivery Time:</span>
          <input
            type="text"
            value={medicine.deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            placeholder="Enter estimated delivery time"
            className="mt-1 p-2 border rounded w-full"
          />
        </label>

        {/* Transport Conditions Input */}
        <label className="block mt-4">
          <span>Transport Conditions:</span>
          <input
            type="text"
            value={transportConditions}
            onChange={(e) => setTransportConditions(e.target.value)}
            placeholder="Enter transport conditions"
            className="mt-1 p-2 border rounded w-full"
          />
        </label>

        {/* Quantity Input */}
        <label className="block mt-4">
          <span>Quantity:</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity to distribute"
            className="mt-1 p-2 border rounded w-full"
          />
        </label>

        {/* Modal Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleDistribute}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Distribute
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

  )
}

export default DistributeModal
