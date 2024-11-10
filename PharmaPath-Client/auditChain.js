const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "regulators",                    
    "pharmachain",                   
    "Pharma-Chain",                  
    "PharmaSupplyChainContract",     
    "auditChain",              
    "",                              
    "auditSupplyChain",              
    "batch001"                       
).then(result => {
    console.log("Audit details for the drug batch:", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking auditSupplyChain:", error);
});
