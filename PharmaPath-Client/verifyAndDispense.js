const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "regulators",                     
    "pharmachain",                   
    "Pharma-Chain",                  
    "PharmaSupplyChainContract",     
    "verifyAndDispense",         
    "",                              
    "verifyAndDispenseDrug",         
    "BATCH123",                      
    "PHARMACY001"        
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Drug batch BATCH123 has been verified and dispensed to PHARMACY001.");
}).catch(error => {
    console.error("Error invoking verifyAndDispenseDrug:", error);
});
