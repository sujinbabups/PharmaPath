import React, { useState } from 'react';

function TransferModal({ isOpen, onClose, onTransfer }) {
  const [medicineId, setMedicineId] = useState('');
  const [wholesalerId, setWholesalerId] = useState('');

  if (!isOpen) return null;

  const handleTransfer = () => {
    onTransfer(medicineId, wholesalerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-lg font-semibold mb-4">Transfer to Wholesaler</h2>
        <label className="block mb-2">
          Medicine ID:
          <input
            type="text"
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            className="border p-2 w-full mt-1 rounded"
          />
        </label>
        <label className="block mb-4">
          Wholesaler ID:
          <input
            type="text"
            value={wholesalerId}
            onChange={(e) => setWholesalerId(e.target.value)}
            className="border p-2 w-full mt-1 rounded"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleTransfer}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Transfer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferModal;
