const { clientApplication } = require('./client')

let userClient = new clientApplication()
userClient.submitTxn(
    "manufacturer",
    "pharmachain",
    "Pharma-Chain",
    "PharmaSupplyChainContract",
    "getMedicines",
    "",
    "getDrugDetails",
    "BATCH123",
).then(result => {
            // Decode the Uint8Array to a string
            const decodedString = new TextDecoder().decode(result);
    
            // Parse the string as JSON
            const jsonObject = JSON.parse(decodedString);
            
            console.log("Medicine details: ")
            // Log the JSON object
            console.log(jsonObject);
});


