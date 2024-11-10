const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "manufacturer",                    
    "pharmachain",                   
    "Pharma-Chain",                  
    "PharmaSupplyChainContract",     
    "queryTransferedMedicines",              
    "",                              
    "queryTransferredToWholesalerMedicines",              
).then(result => {
    console.log("Audit details for the drug batch:", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking auditSupplyChain:", error);
});
