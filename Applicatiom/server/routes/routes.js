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
    let medicineData = await manufactureClient.submitTxn(
      "manufacturer",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "getMedicines",
      "",
      "getDrugDetails",
      batchId
    );

    const decodedData = new TextDecoder().decode(medicineData);
    const parsedData = JSON.parse(decodedData);

    res.status(200).json({
      success: true,
      message: "Data read successfully!",
      data: parsedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
      error: error.message || "Unknown error",
    });
  }
});

router.post("/registerMedicine", async (req, res) => {
    try {
      const { batchId, drugName, batchNumber,quantity, expirationDate, productionDate, manufacturerId } = req.body;
  
      let ManufacturerClient = new clientApplication();
  
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
        quantity,               
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
  
router.get("/allMedicines", async (req, res) => {
  try {
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "manufacturer",                   
      "pharmachain",                  
      "Pharma-Chain",                 
      "PharmaSupplyChainContract",  
      "allMedicines",  
      "",
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

router.post("/verifyMedicine", async (req, res) => {
  try {
    const { batchId,remarks} = req.body;
    if (!batchId ) {
      return res.status(400).json({
        success: false,
        message: "Batch is required.",
      });
    }

    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "regulators",
      "pharmachain",
      "Pharma-Chain",
      "PharmaSupplyChainContract",
      "varifyDrugs",
      "",
      "verifyTemperatureControl",
  
      batchId,
      remarks
    );

    res.status(200).json({
      success: true,
      message: "Medicine verified successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying medicine.",
      data: { error },
    });
  }
});


router.post("/getHistory", async (req, res) => {
  try {
    const { batchId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "regulators", 
      "pharmachain", 
      "Pharma-Chain", 
      "PharmaSupplyChainContract", 
      "medicineHistory", 
      "",
      "getMedicineHistory",
      batchId
    );
    res.status(200).json({
      success: true,
      message: "Medicine History retrieved successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving history details.",
      data: { error },
    });
  }
});


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

router.post("/transferToWholesaler", async (req, res) => {
  try {
    const { batchId, wholesalerId } = req.body;
    
    // Initialize a new instance of the client application
    let userClient = new clientApplication();
    
    // Submit transaction to transfer the medicine to wholesaler
    const result = await userClient.submitTxn(
      "manufacturer", 
      "pharmachain", 
      "Pharma-Chain", 
      "PharmaSupplyChainContract", 
      "transferToWholesaler", 
      "",
      "transferToWholesaler", 
      batchId,
      wholesalerId
    );

    res.status(200).json({
      success: true,
      message: "Medicine transferred to wholesaler successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Error transferring medicine to wholesaler.",
      data: { error: error.message },
    });
  }
});

router.get('/getTransferedMedicines', async (req, res) => {
  try {
    let userClient = new clientApplication();

      const result = await userClient.submitTxn(
          "regulators",                    
          "pharmachain",                   
          "Pharma-Chain",                  
          "PharmaSupplyChainContract",     
          "queryTransferedMedicines",      
          "",                               
          "queryTransferredToWholesalerMedicines"  
      );

      // Send success response with the result
      res.status(200).send({ message: 'Audit details retrieved successfully', result: new TextDecoder().decode(result) });
  } catch (error) {
      console.error("Error invoking queryTransferedMedicines:", error);
      res.status(500).send({ error: 'Error during query' });
  }
});


router.post("/distributeDrug", async (req, res) => {
  try {
    const { batchId, wholesalerId, transitTime, condition,quantity } = req.body;
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
      condition,
      quantity
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


router.get("/getTransitMedicine", async (req, res) => {
  try {
    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "pharmacies",                 
      "pharmachain",                
      "Pharma-Chain",               
      "PharmaSupplyChainContract",  
      "queryTransitTransactions",   
      "",                           
      "queryMedicinesInTransit"     
    );

    res.status(200).json({
      success: true,
      message: "Medicines in transit retrieved successfully!",
      data: JSON.parse(new TextDecoder().decode(result)),
    });
  } catch (error) {
    console.error("Error querying 'In Transit' medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error querying medicines in transit.",
      data: { error: error.toString() },
    });
  }
});


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

router.get("/readOrder", async (req, res) => {
  try {
    const { orderId } = req.body;
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "pharmacies",                 
      "pharmachain", 
      "Pharma-Chain",                 
      "OrderContract",   
      "getOrders",
      "",
      "readOrder",          
      
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
router.post("/newOrder", async (req, res) => {
  try {
    // Destructure fields from req.body as sent from the frontend
    const { drugName, dosage, quantity, pharmacyName } = req.body;
    
    // Generate an orderId or receive it from the frontend
    const orderId = `Order-${Date.now()}`; // or use any unique identifier

    // Convert fields into Buffer objects as required by Hyperledger Fabric
    const transientData = {
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
      orderId             
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
    });
  } catch (error) {
    console.error("Error creating order:", error); 
    res.status(500).json({
      success: false,
      message: "Error in creating order.",
      data: { error: error.message },
    });
  }
});

router.get("/readAllOrders", async (req, res) => {
  try {
    let userClient = new clientApplication();
    const result = await userClient.submitTxn(
      "pharmacies",                  
      "pharmachain",                
      "Pharma-Chain",                
      "OrderContract",                
      "getOrders",                   
      {},                             
      "readAllOrders"                
    );

    const decodedResult = new TextDecoder().decode(result);
    const orders = JSON.parse(decodedResult);

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully!",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving all orders:", error); // Log server error details
    res.status(500).json({
      success: false,
      message: "Error in retrieving all orders.",
      data: { error: error.message || error },
    });
  }
});



module.exports = router;



