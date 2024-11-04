const express = require("express");
const router = express.Router();
const { clientApplication } = require("./client");

  router.get("/getMedicines", async (req, res) => {
    try {
      const { batchId } = req.query; 
  
      if (!batchId) {
        return res.status(400).json({
          success: false,
          message: "batchId is required",
        });
      }
  
      let manufactureClient = new clientApplication();
      let cars = await manufactureClient.submitTxn(
        "manufacturer",
        "pharmachain",
        "Pharma-Chain",
        "PharmaSupplyChainContract",
        "getMedicines",
        "",
        "getDrugDetails",
        batchId
      );
      const data = new TextDecoder().decode(cars);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Data read successfully!",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching data.",
        data: { error },
      });
    }
  });
  
router.post("/registerMedicine", async (req, res) => {
    try {
      const { batchId, drugName, batchNumber, expirationDate, productionDate, manufacturerId } = req.body;
  
      // Initialize the client application for the manufacturer organization
      let ManufacturerClient = new clientApplication();
  
      // Submit transaction to register a new medicine
      const result = await ManufacturerClient.submitTxn(
        "manufacturer",           
        "pharmachain",           
        "Pharma-Chain",           
        "PharmaSupplyChainContract",        
        "registerMedicine",               
        "",                        
        "registerDrug",          
        batchId,               
        drugName,                      
        batchNumber,               
        expirationDate,              
        productionDate,            
        manufacturerId                 
      );
  
      res.status(201).json({
        success: true,
        message: "Medicine registered successfully!",
        data: { result },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in registering medicine. Please check the Medicine ID!",
        data: { error },
      });
    }
  });
  
// Get all medicines
router.get("/allMedicines", async (req, res) => {
  try {
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "regulators",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "allMedicines",
      "queryAllMedicines"
    );
    res.status(200).json({
      success: true,
      message: "All medicines retrieved successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving all medicines.",
      data: { error },
    });
  }
});

// Audit chain
router.get("/auditChain", async (req, res) => {
  try {
    const { batchId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "regulators",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "auditChain",
      "",
      "auditSupplyChain",
      batchId
    );
    res.status(200).json({
      success: true,
      message: "Audit details retrieved successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving audit details.",
      data: { error },
    });
  }
});

// Delete a medicine
router.delete("/deleteMedicine", async (req, res) => {
  try {
    const { batchId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "manufacturer",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "deleteMedicine",
      "",
      "deleteMedicine",
      batchId
    );
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting medicine.",
      data: { error },
    });
  }
});

// Distribute a drug
router.post("/distributeDrug", async (req, res) => {
  try {
    const { batchId, wholesalerId, transitTime, condition } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "wholesaler",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "distributeDrug",
      "",
      "distributeDrug",
      batchId,
      wholesalerId,
      transitTime,
      condition
    );
    res.status(200).json({
      success: true,
      message: "Drug distributed successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error distributing drug.",
      data: { error },
    });
  }
});

// Verify and dispense drug
router.post("/verifyAndDispense", async (req, res) => {
  try {
    const { batchId, pharmacyId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "regulators",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "verifyAndDispense",
      "",
      "verifyAndDispenseDrug",
      batchId,
      pharmacyId
    );
    res.status(200).json({
      success: true,
      message: "Drug verified and dispensed successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in verifying and dispensing drug.",
      data: { error },
    });
  }
});

// Read order
router.get("/readOrder", async (req, res) => {
  try {
    const { orderId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "manufacturer",
      "pharmachain",
      "Pharma-Chain",
      "OrderContract",
      "readOrder",
      "getOrders",
      orderId
    );
    res.status(200).json({
      success: true,
      message: "Order data retrieved successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in reading order.",
      data: { error },
    });
  }
});

// Create new order
router.post("/newOrder", async (req, res) => {
  try {
    const { batchId, drugName, dosage, quantity, pharmacyName } = req.body;
    const transientData = {
      batchId: Buffer.from(batchId),
      drugName: Buffer.from(drugName),
      dosage: Buffer.from(dosage),
      quantity: Buffer.from(quantity),
      pharmacyName: Buffer.from(pharmacyName),
    };
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "pharmacies",
      "pharmachain",
      "Pharma-Chain",
      "OrderContract",
      "newOrder",
      transientData,
      "createOrder",
      "Order-01"
    );
    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in creating order.",
      data: { error },
    });
  }
});

module.exports = router;



module.exports = router;
