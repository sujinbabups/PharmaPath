import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Wholesaler = () => {
    const [batchId, setBatchId] = useState('');
    const [wholesalerId, setWholesalerId] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [transportConditions, setTransportConditions] = useState('');
    const [drugDetails, setDrugDetails] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchDrugDetails = async () => {
        try {
            const response = await fetch(`/api/getMedicines?batchId=${batchId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch drug details');
            }
            const data = await response.json();
            if (data.success) {
                setDrugDetails(data.data);
                setError(null);
            } else {
                setError(data.message || 'Failed to fetch drug details');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    const distributeDrug = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            const response = await fetch('/api/distributeDrug', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batchId, wholesalerId, deliveryTime, transportConditions }),
            });

            if (!response.ok) {
                throw new Error('Failed to distribute drug');
            }

            const data = await response.json();
            if (data.success) {
                setSuccessMessage(data.message);
                setError(null);
            } else {
                setError(data.message || 'Failed to distribute drug');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
         <Link to="/">Home</Link> 
    <h2>Wholesaler Operations</h2>

    <div>
        <h3>Fetch Drug Details</h3>
        <input
            type="text"
            placeholder="Enter Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
        />
        <button onClick={fetchDrugDetails} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Fetch Details
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {drugDetails && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                <h3>Drug Details:</h3>
                <pre>{JSON.stringify(drugDetails, null, 2)}</pre>
            </div>
        )}
    </div>

    <hr />

    <div>
        <h3>Distribute Drug</h3>
        <form onSubmit={distributeDrug}>
            <input
                type="text"
                placeholder="Enter Batch ID"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            <input
                type="text"
                placeholder="Enter Wholesaler ID"
                value={wholesalerId}
                onChange={(e) => setWholesalerId(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            <input
                type="text"
                placeholder="Enter Delivery Time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            <input
                type="text"
                placeholder="Enter Transport Conditions"
                value={transportConditions}
                onChange={(e) => setTransportConditions(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
                Distribute Drug
            </button>
        </form>

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
</div>
  )
}

export default Wholesaler
