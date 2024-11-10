const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "manufacturer",
    "pharmachain",
    "Pharma-Chain",
    "PharmaSupplyChainContract",
    "registerMedicine",
    "",
    "registerDrug",
    "BATCH123",
    "Paracetamol",
    "BN12345",
    "100",
    "2025-12-31",
    "2024-01-01",
    "Manufacturer001"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("New medicine successfully added")
})

