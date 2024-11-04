import React, { useState } from 'react';
import { Search, PackageSearch, AlertCircle } from 'lucide-react';

const SearchMedicines = () => {
  const [batchId, setBatchId] = useState('');
  const [drugDetails, setDrugDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrugDetails = async (e) => {
    e.preventDefault();
    setError(null);
    setDrugDetails(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/getMedicines?batchId=${batchId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch drug details');
      }
      const data = await response.json();
      
      if (data.success) {
        setDrugDetails(data.data);
      } else {
        setError(data.message || 'Failed to fetch drug details');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (details) => {
    // Filter out null/undefined values and nested objects
    const flattenedDetails = Object.entries(details).filter(([_, value]) => 
      value != null && typeof value !== 'object'
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
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </td>
                <td className="px-6 py-4">{value.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <PackageSearch className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Drug Details Lookup</h1>
        <p className="mt-2 text-gray-600">Enter a batch ID to fetch medicine details</p>
      </div>

      <form onSubmit={fetchDrugDetails} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter Batch ID"
            required
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium 
            transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 
            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching Details...
            </span>
          ) : (
            'Fetch Details'
          )}
        </button>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {drugDetails && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Drug Details</h2>
          {renderTable(drugDetails)}
        </div>
      )}
    </div>
  );
};

export default SearchMedicines;