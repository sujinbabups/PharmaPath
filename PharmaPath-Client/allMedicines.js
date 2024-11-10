const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "manufacturer",                   
    "pharmachain",                  
    "Pharma-Chain",                 
    "PharmaSupplyChainContract",  
    "allMedicines",  
    "",
    "queryAllMedicines"
              
).then(result => {
    console.log("Query Result: ", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking queryAllMedicines:", error);
});
