## PharmaPath
PharmaPath is a blockchain-based solution built on **Hyperledger Fabric** to ensure transparency, security, and traceability in the pharmaceutical supply chain. The project connects four main participants in the supply chain: manufacturers, wholesalers, pharmacies, and regulators. It automates processes using smart contracts, ensuring the authenticity of medicines and reducing counterfeit drugs.

---

## Demo 📹
<a href="https://youtu.be/082dKO2isAw" >
   <img src="https://imgs.search.brave.com/rSpP52cw_hAbxer-wYqAhD3UsJEoszdSQEXxhQ5GwZA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMveW91dHViZS9z/bWFsbC95b3V0dWJl/X1BORzIucG5n"/>
</a>

## 🚀 Features

1. **Drug Registration**: Manufacturers can register new drugs on the blockchain.
2. **Drug Distribution**: Wholesalers can manage and distribute registered drugs to pharmacies.
3. **Drug Verification**: Pharmacies can verify the authenticity of drugs before dispensing.
4. **Auditing**: Regulators can audit the supply chain for compliance and quality control.
5. **Order Management**: Pharmacies can create and manage drug orders using transient data.

---

## 🛠️ Technologies Used

1. **Hyperledger Fabric**:
   - Peer nodes for each organization.
   - CouchDB as the state database.
   - Chaincode written in Go.
2. **Smart Contracts**:
   - **PharmaSupplyChainContract**: Manages drug lifecycle events.
   - **OrderContract**: Handles order creation and management.
3. **Backend**:
   - RESTful API built with Node.js.
   - Server running on port 5000 (configured using Vite).
   - CORS enabled for cross-origin requests.
4. **Frontend**:
   - User-friendly interfaces for stakeholders.
5. **Database**:
   - CouchDB for storing blockchain state data.

---
