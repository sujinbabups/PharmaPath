const { clientApplication } = require('./client');

let userClient = new clientApplication();

userClient.submitTxn(
    "regulators",                   
    "pharmachain",                   
    "Pharma-Chain",                  
    "PharmaSupplyChainContract",    
    "varifyDrugs",      
    "",
    "verifyTemperatureControl",                           
    "batch001",                      
    "pharmacy001"         
    
).then(result => {
    console.log("Verification result:", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking verifyTemperatureControl:", error);
});
