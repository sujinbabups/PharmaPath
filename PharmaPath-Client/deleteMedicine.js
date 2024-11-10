const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "manufacturer",                 
    "pharmachain",                  
    "Pharma-Chain",                
    "PharmaSupplyChainContract",    
    "deleteMedicine",               
    "",
    "deleteMedicine",                     
    "BATCH123"                      
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Medicine BATCH123 has been successfully deleted.");
}).catch(error => {
    console.error("Error invoking deleteMedicine:", error);
});
